import { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    appTitle: "TaskMate",
    addPlaceholder: "Add a new task...",
    addButton: "Add",
    filterAll: "All",
    filterActive: "Active",
    filterCompleted: "Completed",
    noTasks: "No tasks found",
    clearCompleted: "Clear completed",
    tasksRemaining: "tasks remaining",
    tipTitle: "Tips",
    tipText: "Click the checkbox to mark a task as completed!",
    level: "Level",
    totalXP: "Total XP",
    yourProgress: "Your Progress",
    rewards: "Rewards",
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    diamond: "Diamond",
    footer: "Keep learning, keep growing with Duo!",
    // Kanban translations
    columns: {
      backlog: "Backlog",
      doing: "In Progress",
      waitingReview: "Waiting Review",
      review: "Review",
      done: "Done"
    },
    editTask: "Edit Task",
    taskName: "Task Name",
    description: "Description",
    status: "Status",
    priority: "Priority",
    priorities: {
      low: "Low Priority",
      medium: "Medium Priority",
      high: "High Priority"
    },
    tags: "Tags",
    addTag: "Add a tag...",
    save: "Save",
    cancel: "Cancel",
    addTaskToColumn: "Add a task",
    addTaskPlaceholder: "What needs to be done?",
    taskSize: "Task Size",
    taskSizes: {
      P: "Small (15 min)",
      M: "Medium (30 min)",
      G: "Large (1 hour)",
      GG: "Extra Large (2 hours)"
    },
    commitType: "Commit Type",
    commitTypes: {
      feat: "Feature",
      fix: "Bug Fix",
      docs: "Documentation",
      style: "Styling",
      refactor: "Refactor",
      test: "Testing",
      ci: "CI/CD",
      chore: "Maintenance"
    },
    unsavedChanges: "You have unsaved changes!",
    saveChanges: "Save changes",
    discardChanges: "Discard changes",
    changesSaved: "Changes saved successfully!",
    tagsLabel: "Tags (press Enter to add)",
    commitTypeTooltip: "Select the type of change you're making",
    taskSizeTooltip: "Estimate how long this task will take",
    // New translations for task timer and blocked moves
    backwardMoveBlocked: "Backward Move Blocked",
    taskTimerRunning: "Timer running",
    minutesElapsed: "minutes elapsed",
    hoursElapsed: "hours elapsed",
    timerStarted: "Timer started",
    timerStopped: "Timer stopped",
    cannotMoveBackward: "Tasks cannot be moved backward in the workflow"
  },
  pt: {
    appTitle: "Tarefas",
    addPlaceholder: "Adicionar uma nova tarefa...",
    addButton: "Adicionar",
    filterAll: "Todas",
    filterActive: "Ativas",
    filterCompleted: "Concluídas",
    noTasks: "Nenhuma tarefa encontrada",
    clearCompleted: "Limpar concluídas",
    tasksRemaining: "tarefas restantes",
    tipTitle: "Dicas",
    tipText: "Clique na caixa para marcar uma tarefa como concluída!",
    level: "Nível",
    totalXP: "XP Total",
    yourProgress: "Seu Progresso",
    rewards: "Recompensas",
    bronze: "Bronze",
    silver: "Prata",
    gold: "Ouro",
    diamond: "Diamante",
    footer: "Continue aprendendo, continue crescendo com o Duo!",
    columns: {
      backlog: "Pendente",
      doing: "Em Progresso",
      waitingReview: "Aguardando Revisão",
      review: "Revisão",
      done: "Concluído"
    },
    editTask: "Editar Tarefa",
    taskName: "Nome da Tarefa",
    description: "Descrição",
    status: "Status",
    priority: "Prioridade",
    priorities: {
      low: "Baixa Prioridade",
      medium: "Média Prioridade",
      high: "Alta Prioridade"
    },
    tags: "Etiquetas",
    addTag: "Adicionar etiqueta...",
    save: "Salvar",
    cancel: "Cancelar",
    addTaskToColumn: "Adicionar tarefa",
    addTaskPlaceholder: "O que precisa ser feito?",
    taskSize: "Tamanho da Tarefa",
    taskSizes: {
      P: "Pequena (15 min)",
      M: "Média (30 min)",
      G: "Grande (1 hora)",
      GG: "Extra Grande (2 horas)"
    },
    commitType: "Tipo de Commit",
    commitTypes: {
      feat: "Funcionalidade",
      fix: "Correção",
      docs: "Documentação",
      style: "Estilo",
      refactor: "Refatoração",
      test: "Teste",
      ci: "CI/CD",
      chore: "Manutenção"
    },
    unsavedChanges: "Você tem alterações não salvas!",
    saveChanges: "Salvar alterações",
    discardChanges: "Descartar alterações",
    changesSaved: "Alterações salvas com sucesso!",
    tagsLabel: "Etiquetas (pressione Enter para adicionar)",
    commitTypeTooltip: "Selecione o tipo de alteração que você está fazendo",
    taskSizeTooltip: "Estime quanto tempo esta tarefa vai levar",
    // New translations for task timer and blocked moves
    backwardMoveBlocked: "Movimento para Trás Bloqueado",
    taskTimerRunning: "Temporizador em execução",
    minutesElapsed: "minutos decorridos",
    hoursElapsed: "horas decorridas",
    timerStarted: "Temporizador iniciado",
    timerStopped: "Temporizador parado",
    cannotMoveBackward: "As tarefas não podem ser movidas para trás no fluxo de trabalho"
  },
  es: {
    appTitle: "TaskMate",
    addPlaceholder: "Añadir una nueva tarea...",
    addButton: "Añadir",
    filterAll: "Todas",
    filterActive: "Activas",
    filterCompleted: "Completadas",
    noTasks: "No se encontraron tareas",
    clearCompleted: "Limpiar completadas",
    tasksRemaining: "tareas restantes",
    tipTitle: "Consejos",
    tipText: "¡Haga clic en la casilla para marcar una tarea como completada!",
    level: "Nivel",
    totalXP: "XP Total",
    yourProgress: "Tu Progreso",
    rewards: "Recompensas",
    bronze: "Bronce",
    silver: "Plata",
    gold: "Oro",
    diamond: "Diamante",
    footer: "¡Sigue aprendiendo, sigue creciendo con Duo!",
    columns: {
      backlog: "Pendiente",
      doing: "En Progreso",
      waitingReview: "Esperando Revisión",
      review: "Revisión",
      done: "Completado"
    },
    editTask: "Editar Tarea",
    taskName: "Nombre de la Tarea",
    description: "Descripción",
    status: "Estado",
    priority: "Prioridad",
    priorities: {
      low: "Baja Prioridad",
      medium: "Media Prioridad",
      high: "Alta Prioridad"
    },
    tags: "Etiquetas",
    addTag: "Añadir etiqueta...",
    save: "Guardar",
    cancel: "Cancelar",
    addTaskToColumn: "Añadir una tarea",
    addTaskPlaceholder: "¿Qué hay que hacer?",
    taskSize: "Tamaño de la Tarea",
    taskSizes: {
      P: "Pequeña (15 min)",
      M: "Mediana (30 min)",
      G: "Grande (1 hora)",
      GG: "Extra Grande (2 horas)"
    },
    commitType: "Tipo de Commit",
    commitTypes: {
      feat: "Característica",
      fix: "Corrección",
      docs: "Documentación",
      style: "Estilo",
      refactor: "Refactorización",
      test: "Prueba",
      ci: "CI/CD",
      chore: "Mantenimiento"
    },
    unsavedChanges: "¡Tienes cambios sin guardar!",
    saveChanges: "Guardar cambios",
    discardChanges: "Descartar cambios",
    changesSaved: "¡Cambios guardados con éxito!",
    tagsLabel: "Etiquetas (presione Enter para agregar)",
    commitTypeTooltip: "Seleccione el tipo de cambio que está realizando",
    taskSizeTooltip: "Estime cuánto tiempo llevará esta tarea",
    // New translations for task timer and blocked moves
    backwardMoveBlocked: "Movimiento Hacia Atrás Bloqueado",
    taskTimerRunning: "Temporizador en marcha",
    minutesElapsed: "minutos transcurridos",
    hoursElapsed: "horas transcurridas",
    timerStarted: "Temporizador iniciado",
    timerStopped: "Temporizador detenido",
    cannotMoveBackward: "Las tareas no pueden moverse hacia atrás en el flujo de trabajo"
  },
  fr: {
    appTitle: "TaskMate",
    addPlaceholder: "Ajouter une nouvelle tâche...",
    addButton: "Ajouter",
    filterAll: "Toutes",
    filterActive: "Actives",
    filterCompleted: "Terminées",
    noTasks: "Aucune tâche trouvée",
    clearCompleted: "Effacer terminées",
    tasksRemaining: "tâches restantes",
    tipTitle: "Conseils",
    tipText: "Cliquez sur la case pour marquer une tâche comme terminée!",
    level: "Niveau",
    totalXP: "XP Total",
    yourProgress: "Votre Progression",
    rewards: "Récompenses",
    bronze: "Bronze",
    silver: "Argent",
    gold: "Or",
    diamond: "Diamant",
    footer: "Continuez à apprendre, continuez à grandir avec Duo!",
    columns: {
      backlog: "À Faire",
      doing: "En Cours",
      waitingReview: "En Attente",
      review: "Révision",
      done: "Terminé"
    },
    editTask: "Modifier la Tâche",
    taskName: "Nom de la Tâche",
    description: "Description",
    status: "Statut",
    priority: "Priorité",
    priorities: {
      low: "Priorité Basse",
      medium: "Priorité Moyenne",
      high: "Priorité Haute"
    },
    tags: "Tags",
    addTag: "Ajouter un tag...",
    save: "Enregistrer",
    cancel: "Annuler",
    addTaskToColumn: "Ajouter une tâche",
    addTaskPlaceholder: "Que faut-il faire?",
    taskSize: "Taille de la Tâche",
    taskSizes: {
      P: "Petite (15 min)",
      M: "Moyenne (30 min)",
      G: "Grande (1 heure)",
      GG: "Très Grande (2 heures)"
    },
    commitType: "Type de Commit",
    commitTypes: {
      feat: "Fonctionnalité",
      fix: "Correction",
      docs: "Documentation",
      style: "Style",
      refactor: "Refactorisation",
      test: "Test",
      ci: "CI/CD",
      chore: "Maintenance"
    },
    unsavedChanges: "Vous avez des modifications non enregistrées!",
    saveChanges: "Enregistrer les modifications",
    discardChanges: "Annuler les modifications",
    changesSaved: "Modifications enregistrées avec succès!",
    tagsLabel: "Tags (appuyez sur Entrée pour ajouter)",
    commitTypeTooltip: "Sélectionnez le type de modification que vous effectuez",
    taskSizeTooltip: "Estimez le temps que prendra cette tâche",
    // New translations for task timer and blocked moves
    backwardMoveBlocked: "Mouvement en Arrière Bloqué",
    taskTimerRunning: "Minuteur en cours",
    minutesElapsed: "minutes écoulées",
    hoursElapsed: "heures écoulées",
    timerStarted: "Minuteur démarré",
    timerStopped: "Minuteur arrêté",
    cannotMoveBackward: "Les tâches ne peuvent pas être déplacées en arrière dans le flux de travail"
  },
  de: {
    appTitle: "TaskMate",
    addPlaceholder: "Neue Aufgabe hinzufügen...",
    addButton: "Hinzufügen",
    filterAll: "Alle",
    filterActive: "Aktive",
    filterCompleted: "Abgeschlossene",
    noTasks: "Keine Aufgaben gefunden",
    clearCompleted: "Abgeschlossene löschen",
    tasksRemaining: "verbleibende Aufgaben",
    tipTitle: "Tipps",
    tipText: "Klicken Sie auf das Kästchen, um eine Aufgabe als erledigt zu markieren!",
    level: "Stufe",
    totalXP: "Gesamt-XP",
    yourProgress: "Ihr Fortschritt",
    rewards: "Belohnungen",
    bronze: "Bronze",
    silver: "Silber",
    gold: "Gold",
    diamond: "Diamant",
    footer: "Lernen Sie weiter, wachsen Sie weiter mit Duo!",
    columns: {
      backlog: "Ausstehend",
      doing: "In Bearbeitung",
      waitingReview: "Wartet auf Prüfung",
      review: "Prüfung",
      done: "Erledigt"
    },
    editTask: "Aufgabe bearbeiten",
    taskName: "Aufgabenname",
    description: "Beschreibung",
    status: "Status",
    priority: "Priorität",
    priorities: {
      low: "Niedrige Priorität",
      medium: "Mittlere Priorität",
      high: "Hohe Priorität"
    },
    tags: "Tags",
    addTag: "Tag hinzufügen...",
    save: "Speichern",
    cancel: "Abbrechen",
    addTaskToColumn: "Aufgabe hinzufügen",
    addTaskPlaceholder: "Was muss getan werden?",
    taskSize: "Aufgabengröße",
    taskSizes: {
      P: "Klein (15 min)",
      M: "Mittel (30 min)",
      G: "Groß (1 Stunde)",
      GG: "Extra Groß (2 Stunden)"
    },
    commitType: "Commit-Typ",
    commitTypes: {
      feat: "Feature",
      fix: "Fehlerkorrektur",
      docs: "Dokumentation",
      style: "Styling",
      refactor: "Refaktorierung",
      test: "Test",
      ci: "CI/CD",
      chore: "Wartung"
    },
    unsavedChanges: "Sie haben ungespeicherte Änderungen!",
    saveChanges: "Änderungen speichern",
    discardChanges: "Änderungen verwerfen",
    changesSaved: "Änderungen erfolgreich gespeichert!",
    tagsLabel: "Tags (Drücken Sie Enter zum Hinzufügen)",
    commitTypeTooltip: "Wählen Sie die Art der Änderung aus, die Sie vornehmen",
    taskSizeTooltip: "Schätzen Sie, wie lange diese Aufgabe dauern wird",
    // New translations for task timer and blocked moves
    backwardMoveBlocked: "Rückwärtsbewegung Blockiert",
    taskTimerRunning: "Timer läuft",
    minutesElapsed: "Minuten vergangen",
    hoursElapsed: "Stunden vergangen",
    timerStarted: "Timer gestartet",
    timerStopped: "Timer gestoppt",
    cannotMoveBackward: "Aufgaben können im Workflow nicht rückwärts verschoben werden"
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    return savedLanguage || 'en';
  });
  
  const [texts, setTexts] = useState(translations[language]);
  
  useEffect(() => {
    setTexts(translations[language]);
    localStorage.setItem('userLanguage', language);
  }, [language]);
  
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, texts, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};