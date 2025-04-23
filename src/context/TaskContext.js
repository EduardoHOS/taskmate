import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  // Column constants
  const COLUMNS = {
    BACKLOG: 'backlog',
    DOING: 'doing',
    WAITING_REVIEW: 'waitingReview',
    REVIEW: 'review',
    DONE: 'done'
  };

  // Initialize the logger
  const logActivity = (action, details) => {
    console.log(`[TaskMate ${new Date().toISOString()}] ${action}:`, details);
  };

  // Load tasks from localStorage or use empty array
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      logActivity('Loaded tasks from localStorage', { count: parsedTasks.length });
      return parsedTasks;
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  });

  // Initialize XP counter
  const [xp, setXp] = useState(() => {
    try {
      const savedXp = localStorage.getItem('xp');
      const parsedXp = savedXp ? parseInt(savedXp) : 0;
      logActivity('Loaded XP from localStorage', { xp: parsedXp });
      return parsedXp;
    } catch (error) {
      console.error('Error loading XP from localStorage:', error);
      return 0;
    }
  });

  // Load archived tasks
  const [archivedTasks, setArchivedTasks] = useState(() => {
    try {
      const savedArchivedTasks = localStorage.getItem('archivedTasks');
      const parsedArchivedTasks = savedArchivedTasks ? JSON.parse(savedArchivedTasks) : [];
      logActivity('Loaded archived tasks from localStorage', { count: parsedArchivedTasks.length });
      return parsedArchivedTasks;
    } catch (error) {
      console.error('Error loading archived tasks from localStorage:', error);
      return [];
    }
  });

  // Load sprints from localStorage
  const [sprints, setSprints] = useState(() => {
    try {
      const savedSprints = localStorage.getItem('sprints');
      const parsedSprints = savedSprints ? JSON.parse(savedSprints) : [
        // Initial default sprint
        {
          id: 1,
          name: 'Sprint 1',
          startDate: Date.now(),
          endDate: Date.now() + (14 * 24 * 60 * 60 * 1000), // 2 weeks
          status: 'active',
          goal: 'Initial sprint'
        }
      ];
      logActivity('Loaded sprints from localStorage', { count: parsedSprints.length });
      return parsedSprints;
    } catch (error) {
      console.error('Error loading sprints from localStorage:', error);
      return [{
        id: 1,
        name: 'Sprint 1',
        startDate: Date.now(),
        endDate: Date.now() + (14 * 24 * 60 * 60 * 1000), // 2 weeks
        status: 'active',
        goal: 'Initial sprint'
      }];
    }
  });
  
  // Active sprint
  const [activeSprint, setActiveSprint] = useState(() => {
    try {
      const savedActiveSprint = localStorage.getItem('activeSprint');
      return savedActiveSprint ? parseInt(savedActiveSprint, 10) : 1;
    } catch (error) {
      console.error('Error loading active sprint from localStorage:', error);
      return 1;
    }
  });

  // Compute level based on XP
  const level = Math.floor(xp / 100) + 1;

  // Keep localStorage in sync with state
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      logActivity('Saved tasks to localStorage', { count: tasks.length });
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('xp', xp.toString());
      logActivity('Saved XP to localStorage', { xp });
    } catch (error) {
      console.error('Error saving XP to localStorage:', error);
    }
  }, [xp]);

  useEffect(() => {
    try {
      localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
      logActivity('Saved archived tasks to localStorage', { count: archivedTasks.length });
    } catch (error) {
      console.error('Error saving archived tasks to localStorage:', error);
    }
  }, [archivedTasks]);
  
  // Save sprints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sprints', JSON.stringify(sprints));
      logActivity('Saved sprints to localStorage', { count: sprints.length });
    } catch (error) {
      console.error('Error saving sprints to localStorage:', error);
    }
  }, [sprints]);
  
  // Save active sprint to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('activeSprint', activeSprint.toString());
      logActivity('Saved active sprint to localStorage', { activeSprint });
    } catch (error) {
      console.error('Error saving active sprint to localStorage:', error);
    }
  }, [activeSprint]);
  
  // Timer logic - runs for DOING tasks
  useEffect(() => {
    // Only run timer for tasks in the DOING column
    if (!tasks.some(task => task.status === COLUMNS.DOING)) {
      return;
    }
    
    logActivity('Starting timer for DOING tasks', { 
      doingTasks: tasks.filter(t => t.status === COLUMNS.DOING).length 
    });
    
    const interval = setInterval(() => {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.status === COLUMNS.DOING) {
            // Check if timeTracking exists, if not, initialize it
            const timeTracking = task.timeTracking || {
              doing: 0,
              waitingReview: 0, 
              review: 0,
              totalTime: 0
            };
            
            // Increment the doing time and total time
            const updatedTimeTracking = {
              ...timeTracking,
              doing: timeTracking.doing + 1,
              totalTime: timeTracking.totalTime + 1
            };
            
            return {
              ...task,
              timeTracking: updatedTimeTracking
            };
          }
          return task;
        });
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      logActivity('Stopped timer for DOING tasks', {});
    };
  }, [tasks, COLUMNS.DOING]);

  // Generate unique ID for new tasks
  const generateUniqueId = () => {
    const existingIds = tasks.map(task => task.id).filter(id => id !== undefined);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return maxId + 1;
  };

  // Generate unique ID for sprints
  const generateUniqueSprintId = () => {
    const existingIds = sprints.map(sprint => sprint.id);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return maxId + 1;
  };

  // Create a new sprint
  const createSprint = (sprintData) => {
    try {
      // Generate a unique ID
      const newId = generateUniqueSprintId();
      
      const newSprint = {
        id: newId,
        name: sprintData.name || `Sprint ${newId}`,
        startDate: sprintData.startDate || Date.now(),
        endDate: sprintData.endDate || (Date.now() + (14 * 24 * 60 * 60 * 1000)), // Default 2 weeks
        status: 'active',
        goal: sprintData.goal || ''
      };
      
      setSprints(prev => [...prev, newSprint]);
      logActivity('Created new sprint', { id: newId, name: newSprint.name });
      
      return newId;
    } catch (error) {
      console.error('Error creating sprint:', error);
      return null;
    }
  };
  
  // Update an existing sprint
  const updateSprint = (sprintId, updates) => {
    try {
      setSprints(prev => {
        return prev.map(sprint => {
          if (sprint.id === sprintId) {
            const updatedSprint = { ...sprint, ...updates };
            logActivity('Updated sprint', { id: sprintId, updates });
            return updatedSprint;
          }
          return sprint;
        });
      });
    } catch (error) {
      console.error('Error updating sprint:', error);
    }
  };
  
  // Complete a sprint and move incomplete tasks to next sprint
  const completeSprint = (sprintId, nextSprintId) => {
    try {
      // 1. Find sprint to complete
      const sprintToComplete = sprints.find(s => s.id === sprintId);
      if (!sprintToComplete) {
        console.error(`Sprint with ID ${sprintId} not found`);
        return;
      }
      
      // 2. Update sprint status
      updateSprint(sprintId, { status: 'completed', endDate: Date.now() });
      
      // 3. Move incomplete tasks to next sprint
      if (nextSprintId) {
        setTasks(prev => {
          return prev.map(task => {
            // If task is in current sprint and not completed, move to next sprint
            if (task.sprintId === sprintId && !task.completed) {
              logActivity('Moved task to next sprint', { 
                taskId: task.id, 
                fromSprint: sprintId, 
                toSprint: nextSprintId 
              });
              return { ...task, sprintId: nextSprintId };
            }
            return task;
          });
        });
      }
      
      // 4. Set active sprint to next sprint
      if (nextSprintId) {
        setActiveSprint(nextSprintId);
      }
      
      logActivity('Completed sprint', { id: sprintId, nextSprintId });
    } catch (error) {
      console.error('Error completing sprint:', error);
    }
  };
  
  // Set active sprint
  const setCurrentSprint = (sprintId) => {
    try {
      const sprintExists = sprints.some(s => s.id === sprintId);
      if (!sprintExists) {
        console.error(`Sprint with ID ${sprintId} not found`);
        return;
      }
      
      setActiveSprint(sprintId);
      logActivity('Changed active sprint', { newActiveSprint: sprintId });
    } catch (error) {
      console.error('Error setting active sprint:', error);
    }
  };
  
  // Get tasks for a specific sprint
  const getTasksBySprint = (sprintId) => {
    try {
      return tasks.filter(task => task.sprintId === sprintId);
    } catch (error) {
      console.error('Error getting tasks by sprint:', error);
      return [];
    }
  };
  
  // Get all active sprints
  const getActiveSprints = () => {
    try {
      return sprints.filter(sprint => sprint.status === 'active');
    } catch (error) {
      console.error('Error getting active sprints:', error);
      return [];
    }
  };

  // Add task (with sprint integration)
  const addTask = (newTask) => {
    try {
      // Generate a unique ID for the task
      const id = generateUniqueId();
      
      // Initialize timeTracking for new task
      const taskWithTime = {
        id,
        ...newTask,
        sprintId: newTask.sprintId || activeSprint, // Default to active sprint
        timeTracking: {
          doing: 0,
          waitingReview: 0,
          review: 0,
          totalTime: 0
        },
        columnEntryTime: Date.now(), // Track when task enters a column
        createdAt: Date.now()        // Track when task was created
      };
      
      setTasks(prevTasks => [...prevTasks, taskWithTime]);
      setXp(prevXp => prevXp + 5); // Award XP for adding a task
      
      logActivity('Added new task', { 
        id, 
        name: newTask.name, 
        status: newTask.status,
        sprintId: taskWithTime.sprintId
      });
      return id;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  };

  // Delete task
  const handleDelete = (id) => {
    try {
      setTasks(prevTasks => {
        const filteredTasks = prevTasks.filter(task => task.id !== id);
        logActivity('Deleted task', { id, tasksRemaining: filteredTasks.length });
        return filteredTasks;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Edit task
  const editTask = (editedTask) => {
    try {
      if (!editedTask || !editedTask.id) {
        console.error('Invalid edited task provided');
        return;
      }
      
      console.log('Editing task with data:', editedTask); // Debug output
      
      setTasks(prevTasks => {
        // Check if the task exists
        const existingTask = prevTasks.find(task => task.id === editedTask.id);
        if (!existingTask) {
          console.error(`Task with ID ${editedTask.id} not found for editing`);
          return prevTasks;
        }
        
        // Update the task, preserving critical fields if not provided
        const updatedTasks = prevTasks.map(task => {
          if (task.id === editedTask.id) {
            const updatedTask = { 
              ...task,          // Start with all existing properties
              ...editedTask,    // Override with edited properties
              // Preserve timing data if not provided in edited task
              timeTracking: editedTask.timeTracking || task.timeTracking,
              columnEntryTime: editedTask.columnEntryTime || task.columnEntryTime,
              sprintId: editedTask.sprintId || task.sprintId || activeSprint // Ensure sprint ID is preserved
            };
            
            console.log('Task after update:', updatedTask); // Debug output
            
            logActivity('Edited task', { 
              id: editedTask.id, 
              name: updatedTask.name,
              status: updatedTask.status,
              description: updatedTask.description,
              commitType: updatedTask.commitType,
              priority: updatedTask.priority,
              size: updatedTask.size,
              sprintId: updatedTask.sprintId
            });
            
            return updatedTask;
          }
          return task;
        });
        
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Move task between columns
  const moveTask = (taskId, targetColumn) => {
    try {
      // Ensure taskId is an integer
      const parsedTaskId = parseInt(taskId, 10);
      
      if (isNaN(parsedTaskId)) {
        console.error(`Invalid task ID: ${taskId}`);
        return;
      }
      
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === parsedTaskId) {
            // Skip time tracking if moving to the same column
            if (task.status === targetColumn) {
              logActivity('Task already in column', { 
                id: parsedTaskId, 
                column: targetColumn 
              });
              return task;
            }
            
            // Calculate time spent in previous column
            const now = Date.now();
            const timeInColumn = task.columnEntryTime ? 
              Math.floor((now - task.columnEntryTime) / 1000) : 0;
            
            // Create proper copy of the timeTracking object with defaults
            const timeTracking = {
              doing: task.timeTracking?.doing || 0,
              waitingReview: task.timeTracking?.waitingReview || 0,
              review: task.timeTracking?.review || 0,
              totalTime: task.timeTracking?.totalTime || 0
            };
            
            // Only update time if we've spent some time in the column
            if (timeInColumn > 0) {
              // Update time for the previous column
              if (task.status === COLUMNS.DOING) {
                timeTracking.doing += timeInColumn;
              } else if (task.status === COLUMNS.WAITING_REVIEW) {
                timeTracking.waitingReview += timeInColumn;
              } else if (task.status === COLUMNS.REVIEW) {
                timeTracking.review += timeInColumn;
              }
              
              // Update total time
              timeTracking.totalTime = 
                timeTracking.doing + 
                timeTracking.waitingReview + 
                timeTracking.review;
            }
            
            // Add XP for moving to DONE column
            if (targetColumn === COLUMNS.DONE && task.status !== COLUMNS.DONE) {
              // Award XP based on task size when completing
              const xpAward = task.size === 'large' ? 30 : 
                              task.size === 'medium' ? 20 : 10;
              setXp(prevXp => prevXp + xpAward);
              logActivity('Task completed, XP awarded', { 
                id: parsedTaskId, 
                xpAward 
              });
            }
            
            logActivity('Moved task between columns', { 
              id: parsedTaskId, 
              from: task.status, 
              to: targetColumn,
              timeInPreviousColumn: timeInColumn,
              updatedTimeTracking: timeTracking
            });
            
            return {
              ...task,
              status: targetColumn,
              columnEntryTime: now,
              timeTracking,
              completed: targetColumn === COLUMNS.DONE
            };
          }
          return task;
        });
      });
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  // Archive task
  const archiveTask = (taskId) => {
    try {
      // Ensure taskId is an integer
      const parsedTaskId = parseInt(taskId, 10);
      
      if (isNaN(parsedTaskId)) {
        console.error(`Invalid task ID for archiving: ${taskId}`);
        return;
      }
      
      // Find the task to archive first without modifying state
      const taskToArchive = tasks.find(task => task.id === parsedTaskId);
      
      if (!taskToArchive) {
        console.error(`Task with ID ${parsedTaskId} not found for archiving`);
        return;
      }
      
      // Add to archived tasks with timestamp
      const archivedTask = {
        ...taskToArchive,
        archivedAt: Date.now()
      };
      
      // Update archived tasks
      setArchivedTasks(prev => [...prev, archivedTask]);
      
      // Remove from active tasks
      setTasks(prevTasks => prevTasks.filter(task => task.id !== parsedTaskId));
      
      logActivity('Archived task', { 
        id: parsedTaskId, 
        name: taskToArchive.name,
        sprintId: taskToArchive.sprintId
      });
      
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };

  // Restore task (fixed to prevent duplicates)
  const restoreTask = (taskId) => {
    try {
      // Ensure taskId is an integer
      const parsedTaskId = parseInt(taskId, 10);
      
      if (isNaN(parsedTaskId)) {
        console.error(`Invalid task ID for restoring: ${taskId}`);
        return;
      }
      
      // Find the task to restore
      const taskToRestore = archivedTasks.find(task => task.id === parsedTaskId);
      
      if (!taskToRestore) {
        console.error(`Task with ID ${parsedTaskId} not found in archived tasks`);
        return;
      }
      
      // Remove archivedAt property
      const { archivedAt, ...taskWithoutArchiveDate } = taskToRestore;
      
      // Check for ID conflicts
      const hasIdConflict = tasks.some(t => t.id === taskWithoutArchiveDate.id);
      
      // Prepare final task object
      let finalTask;
      
      if (hasIdConflict) {
        const newId = generateUniqueId();
        finalTask = { 
          ...taskWithoutArchiveDate, 
          id: newId,
          sprintId: activeSprint // Move to current active sprint when restoring with new ID
        };
        
        logActivity('Restored task with new ID due to conflict', { 
          oldId: parsedTaskId, 
          newId,
          sprintId: finalTask.sprintId
        });
      } else {
        finalTask = {
          ...taskWithoutArchiveDate,
          // If the sprint no longer exists, move to active sprint
          sprintId: sprints.some(s => s.id === taskWithoutArchiveDate.sprintId) 
            ? taskWithoutArchiveDate.sprintId 
            : activeSprint
        };
        
        logActivity('Restored task from archive', { 
          id: parsedTaskId, 
          name: taskToRestore.name,
          sprintId: finalTask.sprintId
        });
      }
      
      // Add to active tasks
      setTasks(prev => [...prev, finalTask]);
      
      // Remove from archived tasks
      setArchivedTasks(prev => prev.filter(task => task.id !== parsedTaskId));
      
    } catch (error) {
      console.error('Error restoring task:', error);
    }
  };

  // Filter tasks by column
  const getTasksByColumn = (columnId) => {
    try {
      if (!columnId) {
        console.error('No column ID provided to getTasksByColumn');
        return [];
      }
      
      return tasks.filter(task => task.status === columnId);
    } catch (error) {
      console.error('Error filtering tasks by column:', error);
      return [];
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    try {
      // Ensure id is an integer
      const parsedId = parseInt(id, 10);
      
      if (isNaN(parsedId)) {
        console.error(`Invalid task ID for toggling completion: ${id}`);
        return;
      }
      
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === parsedId) {
            const newCompleted = !task.completed;
            // Award XP when completing a task
            if (newCompleted) {
              setXp(prevXp => prevXp + 10);
              logActivity('Task marked as complete, XP awarded', { id: parsedId });
            } else {
              logActivity('Task marked as incomplete', { id: parsedId });
            }
            return { ...task, completed: newCompleted };
          }
          return task;
        })
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const isBackwardMove = (fromColumn, toColumn) => {
    try {
      const order = [COLUMNS.BACKLOG, COLUMNS.DOING, COLUMNS.WAITING_REVIEW, COLUMNS.REVIEW, COLUMNS.DONE];
      return order.indexOf(fromColumn) > order.indexOf(toColumn);
    } catch (error) {
      console.error('Error checking backward move:', error);
      return false;
    }
  };

  // All context values (including sprint functions)
  const value = {
    tasks,
    archivedTasks,
    sprints,
    activeSprint,
    addTask,
    handleDelete,
    editTask,
    moveTask,
    archiveTask,
    restoreTask,
    getTasksByColumn,
    toggleComplete,
    createSprint,
    updateSprint,
    completeSprint,
    setCurrentSprint,
    getTasksBySprint,
    getActiveSprints,
    COLUMNS,
    xp,
    level,
    isBackwardMove
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};