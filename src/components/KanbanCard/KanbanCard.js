import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import TimerDisplay from '../TimerDisplay/TimerDisplay';
import './KanbanCard.css';

// Commit type icons with their emojis
const COMMIT_TYPE_ICONS = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '💄',
  refactor: '♻️',
  test: '✅',
  ci: '🔄',
  chore: '🔧'
};

const KanbanCard = ({ task, onEdit, columnId }) => {
  const { handleDelete, moveTask, COLUMNS, archiveTask, sprints } = useTaskContext();
  const { texts } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);

  // Get sprint name from ID
  const getSprintName = (sprintId) => {
    if (!sprintId) return 'No Sprint';
    const sprint = sprints.find(s => s.id === sprintId);
    return sprint ? sprint.name : 'Unknown Sprint';
  };
  
  // Check if sprint is active
  const isActiveSprintTask = () => {
    if (!task.sprintId) return false;
    const sprint = sprints.find(s => s.id === task.sprintId);
    return sprint ? sprint.status === 'active' : false;
  };

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);
    
    // Add data attributes for backward move detection
    e.target.setAttribute('data-task-id', task.id);
    e.target.setAttribute('data-column', columnId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add confirmation for archive action
  const handleArchiveWithConfirmation = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (window.confirm(texts.confirmArchive || 'Are you sure you want to archive this task?')) {
      archiveTask(task.id);
    }
  };

  // Format the estimate time
  const formatEstimateTime = (minutes) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get CSS class based on task priority
  const getPriorityClass = () => {
    if (!task.priority) return '';
    return `priority-${task.priority.toLowerCase()}`;
  };

  // Map stored size values to display values
  const displaySize = (sizeValue) => {
    if (!sizeValue) return '';
    
    // Handle both formats
    if (sizeValue === 'small' || sizeValue === 'P') return 'P';
    if (sizeValue === 'medium' || sizeValue === 'M') return 'M';
    if (sizeValue === 'large' || sizeValue === 'G') return 'G';
    if (sizeValue === 'extra_large' || sizeValue === 'GG') return 'GG';
    
    return sizeValue; // Just return if already in display format
  };

  // Handle card click - edit task
  const handleCardClick = (e) => {
    if (!e.target.closest('.action-button')) {
      onEdit(task);
    }
  };

  // Handle delete with confirmation
  const handleDeleteWithConfirmation = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (window.confirm(texts.confirmDelete || 'Are you sure you want to delete this task?')) {
      handleDelete(task.id);
    }
  };

  return (
    <div 
      className={`card-container ${getPriorityClass()} ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable={!task.completed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      data-task-id={task.id}
      data-column={columnId}
    >
      {/* Commit type badge */}
      {task.commitType && COMMIT_TYPE_ICONS[task.commitType] && (
        <div className="commit-type-badge">
          <span className={`commit-type ${task.commitType}`}>
            <span className="commit-type-icon">{COMMIT_TYPE_ICONS[task.commitType]}</span>
            {task.commitType}
          </span>
        </div>
      )}

      {/* Card header with title and size */}
      <div className="card-header">
        <h3 className="card-title">{task.name}</h3>
        <div className="card-header-right">
          {task.completed && (
            <div className="completed-indicator">✓</div>
          )}
          {task.size && (
            <span className="task-size">{displaySize(task.size)}</span>
          )}
        </div>
      </div>

      {/* Add Sprint Badge */}
      <div className={`sprint-badge ${isActiveSprintTask() ? 'active-sprint' : ''}`}>
        {getSprintName(task.sprintId)}
      </div>

      {/* Card description */}
      {task.description && (
        <div className="card-description">{task.description}</div>
      )}

      {/* Timer display with laps */}
      {(task.status === COLUMNS.DOING || 
        (task.timeTracking && task.timeTracking.totalTime > 0)) && (
        <TimerDisplay 
          timeTracking={task.timeTracking} 
          isRunning={task.status === COLUMNS.DOING}
          status={task.status}
          COLUMNS={COLUMNS}
        />
      )}

      {/* Card footer with tags and time estimate */}
      <div className="card-footer">
        {task.tags && task.tags.length > 0 && (
          <div className="card-meta">
            {task.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        {task.estimateMinutes > 0 && (
          <div className="time-estimate">
            <span className="time-icon">⏱</span>
            {formatEstimateTime(task.estimateMinutes)}
          </div>
        )}
      </div>

      {/* Card actions with improved icon rendering */}
      <div className="card-actions">
        <button 
          className="action-button edit-button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          title={texts.editTask || "Edit Task"}
          aria-label={texts.editTask || "Edit Task"}
        >
          <span role="img" aria-hidden="true">✏️</span>
        </button>
        <button 
          className="action-button archive-button"
          onClick={handleArchiveWithConfirmation}
          title={texts.archiveTask || "Archive Task"}
          aria-label={texts.archiveTask || "Archive Task"}
        >
          <span role="img" aria-hidden="true">📦</span>
        </button>
        <button 
          className="action-button delete-button"
          onClick={handleDeleteWithConfirmation}
          title={texts.deleteTask || "Delete Task"}
          aria-label={texts.deleteTask || "Delete Task"}
        >
          <span role="img" aria-hidden="true">🗑️</span>
        </button>
      </div>
    </div>
  );
};

export default KanbanCard;