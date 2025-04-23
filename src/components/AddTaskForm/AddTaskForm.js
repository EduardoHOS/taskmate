import { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './AddTaskForm.css'; // Assuming you have a CSS file for styles

export const AddTaskForm = () => {
  const [newTaskName, setNewTaskName] = useState('');
  const { handleAddTask } = useTaskContext();
  const { texts } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTask(newTaskName);
    setNewTaskName('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        placeholder={texts.addPlaceholder}
        className="task-input"
      />
      <button type="submit" className="add-button">{texts.addButton}</button>
    </form>
  );
};