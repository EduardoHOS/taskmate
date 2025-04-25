import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import { TaskCard } from '../TaskCard';
import { BoxCard } from '../BoxCard';
import { AddTaskForm } from '../AddTaskForm';
import { FilterControls } from '../FilterControls';
import './TaskList.css'; 

export const TaskList = () => {
  const { filteredTasks, handleDelete, handleToggleComplete, clearCompleted } = useTaskContext();
  const { tasks } = useTaskContext();
  const { texts } = useLanguage();

  return (
    <div className="app-container">
      <div className="task-app">
        <AddTaskForm />
        
        <FilterControls />
        
        <ul className="task-list"> 
          {filteredTasks.length === 0 ? (
            <li className="empty-state">{texts.noTasks}</li>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                handleDelete={handleDelete}
                handleToggleComplete={handleToggleComplete}
              />
            ))
          )}
        </ul>
        
        {tasks.some(task => task.completed) && (
          <button className="clear-completed" onClick={clearCompleted}>
            {texts.clearCompleted}
          </button>
        )}
        
        <div className="task-count">
          {tasks.filter(t => !t.completed).length} {texts.tasksRemaining}
        </div>

        <BoxCard result="warning">
          <p className='title'>{texts.tipTitle}</p>  
          <p className='description'>{texts.tipText}</p>
        </BoxCard>
      </div>
    </div>
  );
};