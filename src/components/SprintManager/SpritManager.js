import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './SprintManager.css';

export const SprintManager = () => {
  const { 
    sprints, 
    activeSprint, 
    createSprint, 
    updateSprint,
    completeSprint,
    setCurrentSprint,
    getTasksBySprint,
    tasks
  } = useTaskContext();
  
  const { texts } = useLanguage();
  const [showNewSprintForm, setShowNewSprintForm] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [sprintStats, setSprintStats] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
    goal: ''
  });
  
  useEffect(() => {
    const stats = {};
    
    sprints.forEach(sprint => {
      const sprintTasks = tasks.filter(task => task.sprintId === sprint.id);
      const completedTasks = sprintTasks.filter(task => task.completed);
      
      stats[sprint.id] = {
        totalTasks: sprintTasks.length,
        completedTasks: completedTasks.length,
        progress: sprintTasks.length > 0 
          ? Math.round((completedTasks.length / sprintTasks.length) * 100) 
          : 0,
        daysLeft: calculateDaysLeft(sprint.endDate)
      };
    });
    
    setSprintStats(stats);
  }, [sprints, tasks]);
  
  const calculateDaysLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateSprint = (e) => {
    e.preventDefault();
    
    const newSprintData = {
      ...formData,
      startDate: new Date(formData.startDate).getTime(),
      endDate: new Date(formData.endDate).getTime()
    };
    
    createSprint(newSprintData);
    setShowNewSprintForm(false);
    setFormData({
      name: '',
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
      goal: ''
    });
  };
  
  const handleUpdateSprint = (e) => {
    e.preventDefault();
    
    const updatedSprintData = {
      ...formData,
      startDate: new Date(formData.startDate).getTime(),
      endDate: new Date(formData.endDate).getTime()
    };
    
    updateSprint(editingSprint, updatedSprintData);
    setEditingSprint(null);
    setFormData({
      name: '',
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
      goal: ''
    });
  };
  
  const handleEditSprint = (sprint) => {
    setEditingSprint(sprint.id);
    setFormData({
      name: sprint.name,
      startDate: new Date(sprint.startDate).toISOString().substr(0, 10),
      endDate: new Date(sprint.endDate).toISOString().substr(0, 10),
      goal: sprint.goal || ''
    });
  };
  
  const handleCompleteSprint = (sprintId) => {
    if (!window.confirm(texts.confirmCompleteSprint || 'Are you sure you want to complete this sprint? Incomplete tasks will be moved to the next active sprint.')) {
      return;
    }
    
    const activeSprintsList = sprints.filter(s => s.status === 'active' && s.id !== sprintId);
    let nextSprintId;
    
    if (activeSprintsList.length > 0) {
      nextSprintId = activeSprintsList[0].id;
    } else {
      const newSprintData = {
        name: `Sprint ${sprints.length + 1}`,
        startDate: Date.now(),
        endDate: Date.now() + (14 * 24 * 60 * 60 * 1000),
        goal: 'Next sprint'
      };
      nextSprintId = createSprint(newSprintData);
    }
    
    completeSprint(sprintId, nextSprintId);
  };
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  return (
    <div className="sprint-manager">
      <div className="sprint-manager-header">
        <h2>{texts.sprintManager || "Sprint Manager"}</h2>
        <button 
          className="create-sprint-button"
          onClick={() => setShowNewSprintForm(true)}
        >
          {texts.createNewSprint || "Create New Sprint"}
        </button>
      </div>
      
      {/* New Sprint Form */}
      {showNewSprintForm && (
        <div className="sprint-form-container">
          <h3>{texts.createNewSprint || "Create New Sprint"}</h3>
          <form onSubmit={handleCreateSprint} className="sprint-form">
            <div className="form-group">
              <label htmlFor="name">{texts.sprintName || "Sprint Name"}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">{texts.startDate || "Start Date"}</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">{texts.endDate || "End Date"}</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="goal">{texts.sprintGoal || "Sprint Goal"}</label>
              <textarea
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowNewSprintForm(false)}
              >
                {texts.cancel || "Cancel"}
              </button>
              <button 
                type="submit" 
                className="submit-button"
              >
                {texts.createSprint || "Create Sprint"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Sprint Form */}
      {editingSprint && (
        <div className="sprint-form-container">
          <h3>{texts.editSprint || "Edit Sprint"}</h3>
          <form onSubmit={handleUpdateSprint} className="sprint-form">
            <div className="form-group">
              <label htmlFor="edit-name">{texts.sprintName || "Sprint Name"}</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-startDate">{texts.startDate || "Start Date"}</label>
                <input
                  type="date"
                  id="edit-startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-endDate">{texts.endDate || "End Date"}</label>
                <input
                  type="date"
                  id="edit-endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-goal">{texts.sprintGoal || "Sprint Goal"}</label>
              <textarea
                id="edit-goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setEditingSprint(null)}
              >
                {texts.cancel || "Cancel"}
              </button>
              <button 
                type="submit" 
                className="submit-button"
              >
                {texts.updateSprint || "Update Sprint"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Sprints List */}
      <div className="sprints-list">
        {sprints.length === 0 ? (
          <div className="no-sprints-message">
            {texts.noSprints || "No sprints created yet. Create your first sprint to get started!"}
          </div>
        ) : (
          sprints.map(sprint => {
            const isActive = sprint.id === activeSprint;
            const stats = sprintStats[sprint.id] || { progress: 0, totalTasks: 0, completedTasks: 0, daysLeft: 0 };
            
            return (
              <div 
                key={sprint.id} 
                className={`sprint-card ${isActive ? 'active-sprint' : ''} ${sprint.status === 'completed' ? 'completed-sprint' : ''}`}
              >
                <div className="sprint-header">
                  <h3 className="sprint-name">{sprint.name}</h3>
                  {isActive && (
                    <span className="active-badge">
                      {texts.active || "Active"}
                    </span>
                  )}
                  {sprint.status === 'completed' && (
                    <span className="completed-badge">
                      {texts.completed || "Completed"}
                    </span>
                  )}
                </div>
                
                <div className="sprint-dates">
                  <div><strong>{texts.startDate || "Start"}:</strong> {formatDate(sprint.startDate)}</div>
                  <div><strong>{texts.endDate || "End"}:</strong> {formatDate(sprint.endDate)}</div>
                  {sprint.status !== 'completed' && (
                    <div className="days-left">
                      <strong>{texts.daysLeft || "Days Left"}:</strong> {stats.daysLeft}
                    </div>
                  )}
                </div>
                
                {sprint.goal && (
                  <div className="sprint-goal">
                    <strong>{texts.goal || "Goal"}:</strong> {sprint.goal}
                  </div>
                )}
                
                <div className="sprint-stats">
                  <div className="stat-item">
                    <span className="stat-label">{texts.tasks || "Tasks"}:</span>
                    <span className="stat-value">{stats.totalTasks}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{texts.completed || "Completed"}:</span>
                    <span className="stat-value">{stats.completedTasks}</span>
                  </div>
                </div>
                
                <div className="sprint-progress">
                  <div className="progress-label">
                    <span>{texts.progress || "Progress"}:</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${stats.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {sprint.status !== 'completed' && (
                  <div className="sprint-actions">
                    {!isActive && (
                      <button 
                        className="set-active-button"
                        onClick={() => setCurrentSprint(sprint.id)}
                      >
                        {texts.setActive || "Set Active"}
                      </button>
                    )}
                    
                    <button 
                      className="edit-button"
                      onClick={() => handleEditSprint(sprint)}
                    >
                      {texts.edit || "Edit"}
                    </button>
                    
                    <button 
                      className="complete-button"
                      onClick={() => handleCompleteSprint(sprint.id)}
                    >
                      {texts.complete || "Complete"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};zoo