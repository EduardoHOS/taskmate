import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTaskContext } from '../../context/TaskContext';
import './SprintSelector.css';

export const SprintSelector = ({ value, onChange, label = "Sprint", required = false }) => {
  const { sprints, activeSprint } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // Get the current sprint
  const currentValue = value || activeSprint;
  const currentSprint = sprints.find(sprint => sprint.id === currentValue) || {};
  
  // Filter to show active sprints first, then completed
  const sortedSprints = [...sprints].sort((a, b) => {
    // Sort by status first (active before completed)
    if (a.status !== b.status) {
      return a.status === 'active' ? -1 : 1;
    }
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
  
  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Handle sprint selection
  const handleSelectSprint = (sprintId) => {
    onChange(sprintId);
    setIsOpen(false);
  };
  
  // Render dropdown via portal
  const renderDropdown = () => {
    if (!isOpen) return null;
    
    return ReactDOM.createPortal(
      <div 
        ref={dropdownRef}
        className="sprint-dropdown-portal"
        style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`
        }}
      >
        <div className={`sprint-dropdown open`}>
          <div className="dropdown-arrow"></div>
          {sortedSprints.map(sprint => (
            <div 
              key={sprint.id} 
              className={`sprint-option ${sprint.id === currentValue ? 'selected' : ''}`}
              onClick={() => handleSelectSprint(sprint.id)}
            >
              <span className="sprint-name">{sprint.name}</span>
              {sprint.id === activeSprint && (
                <span className="sprint-status active">Active</span>
              )}
              {sprint.status === 'completed' && (
                <span className="sprint-status completed">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };
  
  return (
    <div className="sprint-selector-wrapper">
      <label htmlFor="sprint-selector">{label}</label>
      <button 
        ref={buttonRef}
        id="sprint-selector"
        type="button"
        className={`sprint-select-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentSprint.name || "Select Sprint"}
      </button>
      
      {renderDropdown()}
      
      {/* Hidden select for form submission if needed */}
      {required && (
        <select 
          name="sprint" 
          value={currentValue} 
          required={required}
          style={{ display: 'none' }}
        >
          {sortedSprints.map(sprint => (
            <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
          ))}
        </select>
      )}
    </div>
  );
};