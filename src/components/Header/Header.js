import { useState, useRef, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from "../../assets/duolingo-owl.gif"; 
import './Header.css'; 

export const Header = () => {
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('streak');
    return savedStreak ? parseInt(savedStreak) : 0;
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { xp, level } = useTaskContext();
  const { language, texts, changeLanguage } = useLanguage();
  
  const xpProgress = xp % 100;
  
  const handleStreakClick = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('streak', newStreak);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getLanguageFlag = (code) => {
    switch(code) {
      case 'en': return '🇺🇸';
      case 'pt': return '🇧🇷';
      case 'es': return '🇪🇸';
      case 'fr': return '🇫🇷';
      case 'de': return '🇩🇪';
      default: return '🌐';
    }
  };
  
  const getLanguageName = (code) => {
    switch(code) {
      case 'en': return 'English';
      case 'pt': return 'Português';
      case 'es': return 'Español';
      case 'fr': return 'Français';
      case 'de': return 'Deutsch';
      default: return code;
    }
  };
  
  return (
    <header className="duolingo-header">
      <div className="header-left">
        <img src={Logo} alt="Duolingo Owl" className="duolingo-logo" />
        <h1>{texts.appTitle}</h1>
      </div>
      
      <div className="header-center">
        <div className="level-indicator">{texts.level} {level}</div>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${xpProgress}%`}}></div>
          </div>
          <div className="xp-display">{xpProgress}/100 XP</div>
        </div>
      </div>
      
      <div className="header-right">
        <div className="streak-container" onClick={handleStreakClick}>
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{streak}</span>
        </div>
        
        <div className="language-selector" ref={dropdownRef}>
          <button 
            className={`language-selector-button ${isDropdownOpen ? 'open' : ''}`}
            onClick={toggleDropdown}
          >
            {getLanguageName(language)}
          </button>
          
          <div className={`language-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <div 
              className={`language-option ${language === 'en' ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage('en');
                setIsDropdownOpen(false);
              }}
            >
              <span className="language-flag">{getLanguageFlag('en')}</span>
              <span className="language-name">English</span>
            </div>
            
            <div 
              className={`language-option ${language === 'pt' ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage('pt');
                setIsDropdownOpen(false);
              }}
            >
              <span className="language-flag">{getLanguageFlag('pt')}</span>
              <span className="language-name">Português</span>
            </div>
            
            <div 
              className={`language-option ${language === 'es' ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage('es');
                setIsDropdownOpen(false);
              }}
            >
              <span className="language-flag">{getLanguageFlag('es')}</span>
              <span className="language-name">Español</span>
            </div>
            
            <div 
              className={`language-option ${language === 'fr' ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage('fr');
                setIsDropdownOpen(false);
              }}
            >
              <span className="language-flag">{getLanguageFlag('fr')}</span>
              <span className="language-name">Français</span>
            </div>
            
            <div 
              className={`language-option ${language === 'de' ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage('de');
                setIsDropdownOpen(false);
              }}
            >
              <span className="language-flag">{getLanguageFlag('de')}</span>
              <span className="language-name">Deutsch</span>
            </div>
          </div>
        </div>
        
        <div className="profile-button">
          <span>👤</span>
        </div>
      </div>
    </header>
  );
};