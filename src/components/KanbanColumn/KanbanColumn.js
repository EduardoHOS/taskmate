import React, { useState } from 'react';
import KanbanCard from '../KanbanCard/KanbanCard';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './KanbanColumn.css';

const KanbanColumn = ({ 
  columnId, 
  title, 
  onEditTask,
  tasks = null 
}) => {
  const { getTasksByColumn, moveTask, addTask: contextAddTask, isBackwardMove, activeSprint } = useTaskContext();
  const { texts } = useLanguage();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showBlockedWarning, setShowBlockedWarning] = useState(false);

  const columnTasks = tasks !== null ? tasks : getTasksByColumn(columnId);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const task = document.querySelector(`[data-task-id="${taskId}"]`);
    const currentStatus = task?.getAttribute('data-column');
    
    if (currentStatus && isBackwardMove(currentStatus, columnId)) {
      // Show warning
      setShowBlockedWarning(true);
      setTimeout(() => setShowBlockedWarning(false), 3000);
      return;
    }
    
    moveTask(taskId, columnId);
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      contextAddTask({
        name: newTaskName,
        status: columnId,
        sprintId: activeSprint 
      });
      setNewTaskName('');
      setIsAddingTask(false);
    }
  };

  return (
    <div 
      className={`column-container ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="task-count">{columnTasks.length}</span>
      </div>
      
      {showBlockedWarning && (
        <div className="blocked-move-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-message">
            {texts.cannotMoveBackward || "Can't move tasks backwards"}
          </div>
        </div>
      )}
      
      <div className="task-list-container">
        {columnTasks.map(task => (
          <KanbanCard 
            key={task.id} 
            task={task} 
            onEdit={() => onEditTask(task)}
            columnId={columnId}
          />
        ))}
        
        {isAddingTask ? (
          <div className="add-task-form-column">
            <input
              type="text"
              className="task-input-column"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder={texts.addTaskPlaceholder || "What needs to be done?"}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <div className="button-group">
              <button 
                className="add-button-column"
                onClick={handleAddTask}
              >
                {texts.addButton || "Add"}
              </button>
              <button 
                className="kanban-cancel-button"
                onClick={() => setIsAddingTask(false)}
              >
                {texts.cancel || "Cancel"}
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="add-task-button"
            onClick={() => setIsAddingTask(true)}
          >
            + {texts.addTaskToColumn || "Add a task"}
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;