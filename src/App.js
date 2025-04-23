import './styles/variables.css';
import './styles/animations.css';
import './styles/common.css';
import { Header } from './components/Header/Header';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { TaskProvider } from './context/TaskContext';
import { LanguageProvider } from './context/LanguageContext';
import { Footer } from './components/Footer/Footer';
import { DebugPanel } from './components/DebugPanel/DebugPanel';
import { ArchiveManager } from './components/ArchiveManager/ArchiveManager';
import BlockedMoveNotification from './components/BlockedMoveNotification/BlockedMoveNotification';

function App() {
  return(
    <LanguageProvider>
      <TaskProvider>
        <div className="app">
          <Header />  
          <KanbanBoard />
          <ArchiveManager />
          <Footer />
          <DebugPanel />
          <BlockedMoveNotification />
        </div>
      </TaskProvider>
    </LanguageProvider>
  );
}

export default App;