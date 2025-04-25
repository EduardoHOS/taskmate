import React, { useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useLanguage } from '../../context/LanguageContext';
import './BlockedMoveNotification.css'; 

const BlockedMoveNotification = () => {
  const { blockedMove, COLUMNS } = useTaskContext();
  const { texts } = useLanguage();
  
  useEffect(() => {
    if (blockedMove) {
      document.body.classList.add('has-notification');
    } else {
      document.body.classList.remove('has-notification');
    }
    
    return () => {
      document.body.classList.remove('has-notification');
    };
  }, [blockedMove]);
  
  if (!blockedMove) return null;
  
  const getColumnName = (columnId) => {
    switch(columnId) {
      case COLUMNS.BACKLOG: return texts.columns?.backlog || "Backlog";
      case COLUMNS.DOING: return texts.columns?.doing || "In Progress";
      case COLUMNS.WAITING_REVIEW: return texts.columns?.waitingReview || "Waiting Review";
      case COLUMNS.REVIEW: return texts.columns?.review || "Review";
      case COLUMNS.DONE: return texts.columns?.done || "Done";
      default: return columnId;
    }
  };
  
  return (
    <div className="blocked-move-notification">
      <div className="notification-icon">⚠️</div>
      <div className="notification-content">
        <div className="notification-title">
          {texts.backwardMoveBlocked || "Backward Move Blocked"}
        </div>
        <div className="notification-message">
          "{blockedMove.taskName}" can't be moved from "{getColumnName(blockedMove.fromStatus)}" to "{getColumnName(blockedMove.toStatus)}".
        </div>
      </div>
    </div>
  );
};

export default BlockedMoveNotification;