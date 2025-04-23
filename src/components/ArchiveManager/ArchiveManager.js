import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './ArchiveManager.css';

export const ArchiveManager = () => {
  const { archivedTasks, restoreTask, sprints } = useTaskContext();
  const { texts } = useLanguage();
  const [selectedSprint, setSelectedSprint] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  
  // Filter archived tasks based on selected sprint and search term
  useEffect(() => {
    // Safety check first
    if (!archivedTasks || !Array.isArray(archivedTasks)) {
      setFilteredTasks([]);
      return;
    }
    
    let filtered = archivedTasks;
    
    // Filter by sprint
    if (selectedSprint !== 'all') {
      const sprintId = parseInt(selectedSprint, 10);
      filtered = filtered.filter(task => task.sprintId === sprintId);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        (task.name && typeof task.name === 'string' && task.name.toLowerCase().includes(term)) || 
        (task.description && typeof task.description === 'string' && task.description.toLowerCase().includes(term)) ||
        (task.tags && Array.isArray(task.tags) && task.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(term)
        ))
      );
    }
    
    // Sort by most recently archived first
    filtered.sort((a, b) => b.archivedAt - a.archivedAt);
    
    setFilteredTasks(filtered);
  }, [selectedSprint, archivedTasks, searchTerm]);
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const getSprintNameById = (sprintId) => {
    if (!sprintId) return 'No Sprint';
    const sprint = sprints.find(s => s.id === sprintId);
    return sprint ? sprint.name : 'Unknown Sprint';
  };
  
  const handleRestore = (taskId) => {
    if (window.confirm(texts.confirmRestore || 'Are you sure you want to restore this task?')) {
      restoreTask(taskId);
    }
  };
  
  // Safe way to handle possibly undefined texts
  const getArchivedTasksText = () => {
    if (texts && texts.archivedTasks && typeof texts.archivedTasks === 'string') {
      return texts.archivedTasks.toLowerCase();
    }
    return "archived tasks";
  };

  const renderViewToggle = () => (
    <div className="view-toggle">
      <button 
        className={viewMode === 'table' ? 'active' : ''} 
        onClick={() => setViewMode('table')}
      >
        📋 Table View
      </button>
      <button 
        className={viewMode === 'card' ? 'active' : ''} 
        onClick={() => setViewMode('card')}
      >
        🗂️ Card View
      </button>
    </div>
  );

  {viewMode === 'table' ? (
    <div className="archived-tasks-container">
      {/* Your existing table code */}
    </div>
  ) : (
    <div className="archive-card-view">
      {filteredTasks.map(task => (
        <div 
          key={task.id} 
          className={`archive-card ${
            Date.now() - task.archivedAt < 86400000 ? 'recently-archived' : ''
          } ${task.completed ? 'completed-task' : ''}`}
        >
          <div className="archive-card-header">
            <div className="task-name">{task.name || "Unnamed Task"}</div>
          </div>
          <div className="archive-card-body">
            {task.description && (
              <div className="task-description">{task.description}</div>
            )}
            <div className="tag-list">
              {(task.tags && task.tags.length > 0) ? (
                task.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))
              ) : (
                <span className="no-tags">No tags</span>
              )}
            </div>
          </div>
          <div className="archive-card-footer">
            <span className="archive-date">
              {new Date(task.archivedAt).toLocaleDateString()}
            </span>
            <button 
              className="restore-button"
              onClick={() => handleRestore(task.id)}
              title="Restore Task"
            >
              Restore
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
  
  
  return (
    <div className="archive-manager">
      <div className="archive-header">
        <h2>{texts?.archivedTasks || "Archived Tasks"}</h2>
        <div className="archive-filters">
          <div className="filter-group">
            <label htmlFor="sprint-filter">{texts?.filterBySprint || "Filter by Sprint"}:</label>
            <select 
              id="sprint-filter" 
              value={selectedSprint}
              onChange={(e) => setSelectedSprint(e.target.value)}
              className="sprint-filter"
            >
              <option value="all">{texts?.allSprints || "All Sprints"}</option>
              {sprints.map(sprint => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name} {sprint.status === 'completed' ? '(Completed)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="search-filter">{texts?.search || "Search"}:</label>
            <input
              id="search-filter"
              type="text"
              placeholder={texts?.searchTasks || "Search in tasks..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-filter"
            />
          </div>
        </div>
      </div>
      
      <div className="archive-count">
        {texts?.showing || "Showing"} <strong>{filteredTasks.length}</strong> {texts?.of || "of"} <strong>{archivedTasks.length}</strong> {getArchivedTasksText()}
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="no-archived-tasks">
          {texts?.noArchivedTasksFound || "No archived tasks found matching your criteria"}
        </div>
      ) : (
        <div className="archived-tasks-container">
          <table className="archived-tasks-table">
            <thead>
              <tr>
                <th>{texts?.taskName || "Task Name"}</th>
                <th>{texts?.sprint || "Sprint"}</th>
                <th>{texts?.tags || "Tags"}</th>
                <th>{texts?.archivedDate || "Archived Date"}</th>
                <th>{texts?.actions || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id} className={task.completed ? 'completed-task' : ''}>
                  <td className="task-name-cell">
                    <div className="task-name">{task.name || "Unnamed Task"}</div>
                    {task.description && (
                      <div className="task-description">{task.description}</div>
                    )}
                  </td>
                  <td>{getSprintNameById(task.sprintId)}</td>
                  <td>
                    <div className="tag-list">
                      {(task.tags && Array.isArray(task.tags) && task.tags.length > 0) ? (
                        task.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))
                      ) : (
                        <span className="no-tags">No tags</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(task.archivedAt)}</td>
                  <td>
                    <button 
                      className="restore-button"
                      onClick={() => handleRestore(task.id)}
                      title={texts?.restoreTask || "Restore Task"}
                    >
                      {texts?.restore || "Restore"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};