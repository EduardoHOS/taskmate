import { useState } from 'react';
import './TaskCard.css'; // Assuming you have a CSS file for styles

export const TaskCard = ({ task, handleToggleComplete, handleDelete }) => {
  const [showXp, setShowXp] = useState(false);
  
  // Guard against undefined task prop
  if (!task) return null;
  
  const handleComplete = () => {
    if (!task.completed) {
      setShowXp(true);
      setTimeout(() => setShowXp(false), 1500);
    }
    handleToggleComplete(task.id);
  };
  
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleComplete}
          className="task-checkbox"
        />
        <span className="task-name">{task.name}</span>
        {showXp && (
          <span className="xp-popup">+10 XP</span>
        )}
      </div>
      <button 
        className="delete-btn"
        onClick={() => handleDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
};