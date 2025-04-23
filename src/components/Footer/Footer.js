import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css'; 

export const Footer = () => {
  const { xp, level } = useTaskContext();
  const { texts } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="duolingo-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{texts.appTitle}</h3>
          <p>Your gamified task manager</p>
        </div>
        
        <div className="footer-section">
          <h3>{texts.yourProgress}</h3>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span>{texts.level} {level}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">✨</span>
              <span>{xp} {texts.totalXP}</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>{texts.rewards}</h3>
          <div className="rewards-list">
            <div className={`reward-badge ${xp >= 100 ? 'earned' : 'locked'}`}>
              <span>🥉</span>
              <div className="reward-tooltip">{texts.bronze}: 100 XP</div>
            </div>
            <div className={`reward-badge ${xp >= 300 ? 'earned' : 'locked'}`}>
              <span>🥈</span>
              <div className="reward-tooltip">{texts.silver}: 300 XP</div>
            </div>
            <div className={`reward-badge ${xp >= 500 ? 'earned' : 'locked'}`}>
              <span>🥇</span>
              <div className="reward-tooltip">{texts.gold}: 500 XP</div>
            </div>
            <div className={`reward-badge ${xp >= 1000 ? 'earned' : 'locked'}`}>
              <span>💎</span>
              <div className="reward-tooltip">{texts.diamond}: 1000 XP</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} {texts.appTitle} - {texts.footer}</p>
      </div>
    </footer>
  );
};