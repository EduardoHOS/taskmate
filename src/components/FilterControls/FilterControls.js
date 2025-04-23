import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './FilterControls.css'; 
export const FilterControls = () => {
  const { filter, setFilter } = useTaskContext();
  const { texts } = useLanguage();

  return (
    <div className="filter-controls">
      <button 
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        {texts.filterAll}
      </button>
      <button 
        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        onClick={() => setFilter('active')}
      >
        {texts.filterActive}
      </button>
      <button 
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => setFilter('completed')}
      >
        {texts.filterCompleted}
      </button>
    </div>
  );
};