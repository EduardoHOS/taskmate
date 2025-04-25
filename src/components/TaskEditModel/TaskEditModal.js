import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import { SprintSelector } from '../SprintSelector/SprintSelector'; 
import './TaskEditModal.css';

const COMMIT_TYPES = {
  feat: { 
    label: 'Feature', 
    description: 'New feature or enhancement',
    icon: '✨'
  },
  fix: { 
    label: 'Fix', 
    description: 'Bug fix',
    icon: '🐛'
  },
  docs: { 
    label: 'Documentation', 
    description: 'Documentation changes',
    icon: '📝'
  },
  style: { 
    label: 'Style', 
    description: 'Formatting, UI changes',
    icon: '💄'
  },
  refactor: { 
    label: 'Refactor', 
    description: 'Code restructuring',
    icon: '♻️'
  },
  test: { 
    label: 'Test', 
    description: 'Adding or fixing tests',
    icon: '✅'
  },
  ci: { 
    label: 'CI', 
    description: 'CI/CD pipeline changes',
    icon: '🔄'
  },
  chore: { 
    label: 'Chore', 
    description: 'Maintenance tasks',
    icon: '🔧'
  }
};

function getCommitTypeColor(type) {
  switch(type) {
    case 'feat': return '#0052cc';
    case 'fix': return '#e94c49';
    case 'docs': return '#6b5aed';
    case 'style': return '#00a78e';
    case 'refactor': return '#e97f33';
    case 'test': return '#57a64a';
    case 'ci': return '#6554c0';
    case 'chore': return '#8993a4';
    default: return '#0052cc';
  }
}

const TaskEditModal = ({ task, onClose }) => {
  const { editTask, COLUMNS } = useTaskContext();
  const { texts } = useLanguage();
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const tagInputRef = useRef(null);
  const modalContentRef = useRef(null);
  
  const mapSizeToValue = (size) => {
    if (!size) return 'M'; 
    if (size === 'small' || size === 'P') return 'P';
    if (size === 'medium' || size === 'M') return 'M';
    if (size === 'large' || size === 'G') return 'G';
    if (size === 'extra_large' || size === 'GG') return 'GG';
    return 'M'; // Default fallback
  };

  const mapValueToSize = (value) => {
    if (value === 'P') return 'small';
    if (value === 'M') return 'medium';
    if (value === 'G') return 'large';
    if (value === 'GG') return 'extra_large';
    return 'medium'; // Default
  };
  
  const formatElapsedTime = (seconds) => {
    if (!seconds) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  };
  
  const [formData, setFormData] = useState({
    name: task.name || '',
    description: task.description || '',
    status: task.status || COLUMNS.BACKLOG,
    priority: task.priority || 'medium',
    size: mapSizeToValue(task.size), // Convert stored size to form value
    commitType: task.commitType || 'feat',
    tags: task.tags || [],
    newTag: '',
    estimateMinutes: task.estimateMinutes || 0,
    sprintId: task.sprintId 
  });
  
  useEffect(() => {
    const sizeTimeMapping = {
      'P': 15,   // 15 minutes
      'M': 30,   // 30 minutes
      'G': 60,   // 1 hour
      'GG': 120  // 2 hours
    };
    
    setFormData(prev => ({
      ...prev,
      estimateMinutes: sizeTimeMapping[prev.size] || 0
    }));
  }, [formData.size]);
  
  useEffect(() => {
    setIsDirty(true);
  }, [formData.name, formData.description, formData.status, 
    formData.priority, formData.size, formData.commitType, 
    formData.tags, formData.sprintId]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.focus();
    }, 100);
    
    const handleEscKey = (e) => {
      if (e.key === 'Escape') handleCloseAttempt();
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCommitTypeChange = (type) => {
    setFormData(prev => ({ ...prev, commitType: type }));
  };

  const handleSprintChange = (sprintId) => {
    setFormData(prev => ({ ...prev, sprintId }));
  };
  
  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
      
      if (tagInputRef.current) tagInputRef.current.focus();
    }
  };
  
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { newTag, ...updatedTaskData } = formData;
    
    const finalTask = {
      ...updatedTaskData,
      id: task.id, 
      size: mapValueToSize(updatedTaskData.size), 
      timeTracking: task.timeTracking || {
        doing: 0,
        waitingReview: 0,
        review: 0,
        totalTime: 0
      },
      columnEntryTime: task.columnEntryTime || Date.now()
    };
    
    console.log('Saving task with data:', finalTask); 
    
    editTask(finalTask);
    setIsDirty(false);
    setShowSaveNotification(true);
    
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 2000);
  };
  
  const handleCloseAttempt = () => {
    if (isDirty) {
      const confirmClose = window.confirm(texts.unsavedChanges || "You have unsaved changes! Are you sure you want to close?");
      if (confirmClose) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div className="modal-overlay" onClick={handleCloseAttempt}>
      <div className="modal-content" onClick={handleModalContentClick} ref={modalContentRef}>
        <div className="modal-header">
          <h2 className="modal-title">{texts.editTask || "Edit Task"}</h2>
          <button className="close-button" onClick={handleCloseAttempt} aria-label="Close">×</button>
        </div>
        
        {showSaveNotification && (
          <div className="save-notification" role="alert">
            {texts.changesSaved || "Changes saved successfully!"}
          </div>
        )}
        
        <form className="edit-task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{texts.taskName || "Task Name"}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              aria-required="true"
            />
          </div>

          <SprintSelector 
            value={formData.sprintId} 
            onChange={handleSprintChange}
            label={texts.sprint || "Sprint"}
          />
          
          {/* Time Tracking Section */}
          {task.timeTracking && (task.timeTracking.doing > 0 || 
                                task.timeTracking.waitingReview > 0 || 
                                task.timeTracking.review > 0) && (
            <div className="form-group">
              <label>{texts.timeTracking || "Time Tracking"}</label>
              <div className="time-tracking-display">
                <div className="time-tracking-total">
                  <strong>{texts.totalTime || "Total Time"}:</strong> {formatElapsedTime(task.timeTracking.totalTime || 0)}
                </div>
                <div className="time-tracking-breakdown">
                  {task.timeTracking.doing > 0 && (
                    <div className="time-tracking-item">
                      <span className="time-label">Doing:</span> {formatElapsedTime(task.timeTracking.doing)}
                    </div>
                  )}
                  {task.timeTracking.waitingReview > 0 && (
                    <div className="time-tracking-item">
                      <span className="time-label">Waiting Review:</span> {formatElapsedTime(task.timeTracking.waitingReview)}
                    </div>
                  )}
                  {task.timeTracking.review > 0 && (
                    <div className="time-tracking-item">
                      <span className="time-label">Review:</span> {formatElapsedTime(task.timeTracking.review)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Commit Type Selection */}
          <div className="form-group">
            <label title={texts.commitTypeTooltip || "Select the type of change you're making"}>
              {texts.commitType || "Commit Type"}
            </label>
            <div className="commit-type-selection" role="radiogroup">
              {Object.entries(COMMIT_TYPES).map(([type, info]) => (
                <div
                  key={type}
                  className={`commit-type-option ${formData.commitType === type ? 'selected' : ''}`}
                  onClick={() => handleCommitTypeChange(type)}
                  title={info.description}
                  style={{
                    backgroundColor: formData.commitType === type ? getCommitTypeColor(type) : '#f4f5f7',
                    color: formData.commitType === type ? 'white' : '#172b4d'
                  }}
                  role="radio"
                  aria-checked={formData.commitType === type}
                  tabIndex={formData.commitType === type ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCommitTypeChange(type);
                    }
                  }}
                >
                  <span className="commit-type-icon">{info.icon}</span>
                  <span className="commit-type-text">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">{texts.description || "Description"}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group form-group-half">
              <label htmlFor="status">{texts.status || "Status"}</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value={COLUMNS.BACKLOG}>{texts.columns?.backlog || "Backlog"}</option>
                <option value={COLUMNS.DOING}>{texts.columns?.doing || "In Progress"}</option>
                <option value={COLUMNS.WAITING_REVIEW}>{texts.columns?.waitingReview || "Waiting Review"}</option>
                <option value={COLUMNS.REVIEW}>{texts.columns?.review || "Review"}</option>
                <option value={COLUMNS.DONE}>{texts.columns?.done || "Done"}</option>
              </select>
            </div>
            
            <div className="form-group form-group-half">
              <label htmlFor="priority">{texts.priority || "Priority"}</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">{texts.priorities?.low || "Low Priority"}</option>
                <option value="medium">{texts.priorities?.medium || "Medium Priority"}</option>
                <option value="high">{texts.priorities?.high || "High Priority"}</option>
              </select>
            </div>
          </div>
          
          {/* Task Size Selection */}
          <div className="form-group">
            <label title={texts.taskSizeTooltip || "Estimate how long this task will take"}>
              {texts.taskSize || "Task Size"}
            </label>
            <div className="size-selection" role="radiogroup">
              <label className={`size-option ${formData.size === 'P' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="size"
                  value="P"
                  checked={formData.size === 'P'}
                  onChange={handleChange}
                />
                <span className="size-label">P</span>
                <span className="size-time">15 min</span>
              </label>
              <label className={`size-option ${formData.size === 'M' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="size"
                  value="M"
                  checked={formData.size === 'M'}
                  onChange={handleChange}
                />
                <span className="size-label">M</span>
                <span className="size-time">30 min</span>
              </label>
              <label className={`size-option ${formData.size === 'G' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="size"
                  value="G"
                  checked={formData.size === 'G'}
                  onChange={handleChange}
                />
                <span className="size-label">G</span>
                <span className="size-time">1h</span>
              </label>
              <label className={`size-option ${formData.size === 'GG' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="size"
                  value="GG"
                  checked={formData.size === 'GG'}
                  onChange={handleChange}
                />
                <span className="size-label">GG</span>
                <span className="size-time">2h</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="newTag">{texts.tagsLabel || "Tags (press Enter to add)"}</label>
            <div className="tag-input-container">
              <input
                type="text"
                id="newTag"
                name="newTag"
                ref={tagInputRef}
                value={formData.newTag}
                onChange={handleChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder={texts.addTag || "Add a tag..."}
                className="form-input tag-input"
              />
              <button 
                type="button" 
                onClick={handleAddTag}
                className="add-tag-button"
                aria-label="Add tag"
              >
                +
              </button>
            </div>
            
            <div className="tag-container">
              {formData.tags.map((tag, index) => (
                <div key={index} className="tag-edit">
                  {tag}
                  <span 
                    className="remove-tag"
                    onClick={() => handleRemoveTag(tag)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove tag ${tag}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRemoveTag(tag);
                      }
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="button-group-modal">
            {isDirty && (
              <div className="unsaved-changes-indicator" role="status">
                <span className="indicator-dot"></span>
                {texts.unsavedChanges || "Unsaved changes"}
              </div>
            )}
            <button 
              type="button" 
              className="cancel-button-modal"
              onClick={handleCloseAttempt}
            >
              {texts.cancel || "Cancel"}
            </button>
            <button 
              type="submit" 
              className={`save-button ${isDirty ? 'save-active' : ''}`}
              disabled={!isDirty}
            >
              {texts.save || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;