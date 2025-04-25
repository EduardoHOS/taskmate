import { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import './DebugPanel.css'; 

export const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contextData = useTaskContext();
  
  if (!isOpen) {
    return (
      <button 
        className="debug-toggle"
        onClick={() => setIsOpen(true)}
      >
        Show Debug
      </button>
    );
  }
  
  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>Debug Panel</h3>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
      <div className="debug-content">
        <h4>Task Data</h4>
        <div className="json-viewer">
          <pre>{JSON.stringify(contextData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};