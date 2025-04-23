import React from 'react';
import './TimerDisplay.css';

const formatElapsedTime = (seconds) => {
  if (!seconds) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [hours, minutes, secs]
    .map(v => v < 10 ? "0" + v : v)
    .join(":");
};

const TimerDisplay = ({ timeTracking, isRunning, status, COLUMNS }) => {
  if (!timeTracking) return null;
  
  const totalTime = timeTracking.totalTime || 0;
  const hasLaps = timeTracking.doing > 0 || 
                  timeTracking.waitingReview > 0 || 
                  timeTracking.review > 0;
  
  return (
    <>
      <div className={`task-timer ${status !== COLUMNS.DOING ? 'task-timer-paused' : ''}`}>
        <div className="timer-icon">⏱️</div>
        <div className="timer-display">
          {formatElapsedTime(totalTime)}
          <span className="timer-status">
            {isRunning ? '⚙️ Running' : '⏸️ Paused'}
          </span>
        </div>
      </div>
      
      {hasLaps && (
        <div className="timer-laps">
          {timeTracking.doing > 0 && (
            <div className="timer-lap doing-lap" title="Time spent in Development">
              <span className="lap-label">Doing</span>
              <span className="lap-time">{formatElapsedTime(timeTracking.doing)}</span>
            </div>
          )}
          
          {timeTracking.waitingReview > 0 && (
            <div className="timer-lap waiting-lap" title="Time spent waiting for review">
              <span className="lap-label">Wait</span>
              <span className="lap-time">{formatElapsedTime(timeTracking.waitingReview)}</span>
            </div>
          )}
          
          {timeTracking.review > 0 && (
            <div className="timer-lap review-lap" title="Time spent in review">
              <span className="lap-label">Review</span>
              <span className="lap-time">{formatElapsedTime(timeTracking.review)}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TimerDisplay;