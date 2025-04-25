import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import TaskEditModal from '../TaskEditModel/TaskEditModal';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import { SprintSelector } from '../SprintSelector/SprintSelector';
import './KanbanBoard.css';

export const KanbanBoard = () => {
  const { 
    COLUMNS, 
    activeSprint,
    tasks,
    getTasksBySprint,
    setCurrentSprint,
    createSprint,
    completeSprint,
    sprints
  } = useTaskContext();
  const { texts } = useLanguage();
  
  const [editingTask, setEditingTask] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(activeSprint || '');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');

  useEffect(() => {
    setSelectedSprint(activeSprint);
  }, [activeSprint]);
  
  useEffect(() => {
    if (selectedSprint) {
      const sprintTasks = getTasksBySprint(selectedSprint);
      setFilteredTasks(sprintTasks);
    } else {
      setFilteredTasks([]);
    }
  }, [selectedSprint, tasks, getTasksBySprint]);

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
  };

  const handleSprintChange = (sprintId) => {
    setSelectedSprint(sprintId);
  };

  const handleSetActiveSprint = () => {
    if (selectedSprint !== activeSprint) {
      setCurrentSprint(selectedSprint);
    }
  };

  const handleCompleteSprint = () => {
    if (window.confirm(texts.confirmCompleteSprint || 'Are you sure you want to complete this sprint? Incomplete tasks will move to the next sprint.')) {
      completeSprint(selectedSprint);
    }
  };

  const handleCreateSprint = () => {
    if (newSprintName.trim()) {
      createSprint(newSprintName.trim());
      setNewSprintName('');
      setShowSprintForm(false);
    }
  };

  const getSprintTasksByColumn = (columnId) => {
    return filteredTasks.filter(task => task.status === columnId);
  };

  const getSelectedSprintName = () => {
    if (!selectedSprint) return '';
    const sprint = sprints.find(s => s.id === selectedSprint);
    return sprint ? sprint.name : '';
  };

  const isSelectedSprintActive = selectedSprint === activeSprint;
  
  const isSelectedSprintCompleted = () => {
    if (!selectedSprint) return false;
    const sprint = sprints.find(s => s.id === selectedSprint);
    return sprint ? sprint.status === 'completed' : false;
  };

  return (
    <div className="kanban-container">
      <div className="board-header">
        <h1 className="board-title">{texts.taskBoard || "Task Board"}</h1>
        
        <div className="sprint-controls">
          <div className="sprint-selector-wrapper">
            <SprintSelector 
              value={selectedSprint}
              onChange={handleSprintChange}
              label={texts.sprint || "Sprint"}
            />
            
            <div className="sprint-stats">
              <span className="task-count">
                {filteredTasks.length} {texts.tasks || "tasks"}
              </span>
              
              {getSelectedSprintName() && (
                <span className="sprint-name-badge">
                  {getSelectedSprintName()}
                  {isSelectedSprintActive && 
                    <span className="active-indicator">{texts.active || "Active"}</span>
                  }
                </span>
              )}
            </div>
          </div>
          
          <div className="sprint-actions">
            {!isSelectedSprintActive && !isSelectedSprintCompleted() && (
              <button 
                onClick={handleSetActiveSprint}
                className="sprint-action-btn set-active-btn"
              >
                <span className="btn-icon">📌</span>
                {texts.setAsActive || "Set as Active"}
              </button>
            )}
            
            {!isSelectedSprintCompleted() && (
              <button 
                onClick={handleCompleteSprint}
                className="sprint-action-btn complete-btn"
              >
                <span className="btn-icon">✓</span>
                {texts.completeSprint || "Complete Sprint"}
              </button>
            )}
            
            <button 
              onClick={() => setShowSprintForm(!showSprintForm)}
              className="sprint-action-btn new-sprint-btn"
            >
              <span className="btn-icon">+</span>
              {texts.newSprint || "New Sprint"}
            </button>
          </div>
        </div>
        
        {showSprintForm && (
          <div className="new-sprint-form">
            <input
              type="text"
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              placeholder={texts.sprintNamePlaceholder || "Enter sprint name..."}
              className="sprint-name-input"
              autoFocus
            />
            <div className="form-buttons">
              <button 
                onClick={handleCreateSprint}
                className="create-sprint-btn"
                disabled={!newSprintName.trim()}
              >
                {texts.createSprint || "Create Sprint"}
              </button>
              <button 
                onClick={() => {
                  setShowSprintForm(false);
                  setNewSprintName('');
                }}
                className="cancel-btn"
              >
                {texts.cancel || "Cancel"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="board-container">
        <KanbanColumn
          columnId={COLUMNS.BACKLOG}
          title={texts.columns?.backlog || "Backlog"}
          onEditTask={handleEditTask}
          tasks={getSprintTasksByColumn(COLUMNS.BACKLOG)}
        />
        
        <KanbanColumn
          columnId={COLUMNS.DOING}
          title={texts.columns?.doing || "In Progress"}
          onEditTask={handleEditTask}
          tasks={getSprintTasksByColumn(COLUMNS.DOING)}
        />
        
        <KanbanColumn
          columnId={COLUMNS.WAITING_REVIEW}
          title={texts.columns?.waitingReview || "Waiting Review"}
          onEditTask={handleEditTask}
          tasks={getSprintTasksByColumn(COLUMNS.WAITING_REVIEW)}
        />
        
        <KanbanColumn
          columnId={COLUMNS.REVIEW}
          title={texts.columns?.review || "Review"}
          onEditTask={handleEditTask}
          tasks={getSprintTasksByColumn(COLUMNS.REVIEW)}
        />
        
        <KanbanColumn
          columnId={COLUMNS.DONE}
          title={texts.columns?.done || "Done"}
          onEditTask={handleEditTask}
          tasks={getSprintTasksByColumn(COLUMNS.DONE)}
        />
      </div>
      
      {editingTask && (
        <TaskEditModal 
          task={editingTask} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default KanbanBoard;