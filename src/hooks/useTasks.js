import { useState, useEffect } from 'react';

const STORAGE_KEY = 'taskflow_tracker_tasks';

const INITIAL_TASKS = {
  backlog: [
    { id: 1, title: 'Проектирование архитектуры базы данных', description: 'Спроектировать схемы для нового модуля аналитики', priority: 'critical', boardId: '1', createdAt: new Date().toISOString() },
    { id: 2, title: 'Обновление документации API', description: 'Описать новые эндпоинты авторизации', priority: 'medium', boardId: '1', createdAt: new Date().toISOString() },
  ],
  ready_for_dev: [
    { id: 3, title: 'Исправление верстки на главной странице', description: 'Поплыл блок карточек на мобильных устройствах', priority: 'high', boardId: '1', createdAt: new Date().toISOString() },
  ],
  in_progress: [
    { id: 4, title: 'Интеграция платежного шлюза', description: 'Подключить эквайринг и протестировать тестовые карты', priority: 'critical', boardId: '1', createdAt: new Date().toISOString() },
  ],
  code_review: [],
  ready_for_testing: [],
  testing: [],
  ready_for_release: [],
  done: [
    { id: 5, title: 'Настройка CI/CD пайплайна', description: 'Автоматический деплой на стейджинг при пуше в main', priority: 'medium', boardId: '1', createdAt: new Date().toISOString() },
  ],
  blocked: [],
};

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Ошибка загрузки задач из localStorage', e);
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Ошибка сохранения задач в localStorage', e);
    }
  }, [tasks]);

  const addTask = (statusKey, taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      boardId: taskData.boardId || '1',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => ({
      ...prev,
      [statusKey]: [newTask, ...(prev[statusKey] || [])],
    }));
  };

  const updateTask = (statusKey, taskId, taskData) => {
    setTasks((prev) => ({
      ...prev,
      [statusKey]: prev[statusKey].map((task) =>
        task.id === taskId ? { ...task, ...taskData } : task
      ),
    }));
  };

  const deleteTask = (statusKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [statusKey]: prev[statusKey].filter((task) => task.id !== taskId),
    }));
  };

  const moveTask = (taskId, sourceStatus, targetStatus) => {
    if (sourceStatus === targetStatus) return;

    setTasks((prev) => {
      const sourceList = [...(prev[sourceStatus] || [])];
      const targetList = [...(prev[targetStatus] || [])];

      const taskIndex = sourceList.findIndex((t) => t.id === Number(taskId));
      if (taskIndex === -1) return prev;

      const [movedTask] = sourceList.splice(taskIndex, 1);
      targetList.unshift(movedTask);

      return {
        ...prev,
        [sourceStatus]: sourceList,
        [targetStatus]: targetList,
      };
    });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
