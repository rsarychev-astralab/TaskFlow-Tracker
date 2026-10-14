# TaskFlow Tracker

Канбан-трекер задач на React + Vite + Ant Design. Работает целиком в браузере: данные лежат в `localStorage`, бэкенда нет.

## Возможности
- Канбан-доска с 9 статусами (от «Бэклог» до «Готово» и «Заблокировано») и drag & drop между колонками
- Создание, редактирование и удаление задач; приоритеты (критический, высокий, средний, низкий) и исполнители
- Несколько досок и проектов, переключение между ними
- Раздел «Задачи»: фильтры по проекту, доске и приоритету, режимы «По доскам» / «Все задачи»
- Раздел «Отчёты» — пока заглушка («в разработке»)

## Стек
React 19, Vite 8, Ant Design 6, dayjs

## Запуск
```bash
npm install
npm run dev      # dev-сервер: http://localhost:3000
npm run build    # сборка в dist/
npm run preview  # просмотр собранной версии
```

## Структура
```
src/
  App.jsx             # layout, разделы, доски и проекты, фильтры
  components/         # KanbanBoard, StatusColumn, TaskCard, TaskModal
  constants/          # статусы, приоритеты, исполнители
  hooks/useTasks.js   # состояние задач + сохранение в localStorage
```

## Данные и секреты
- Задачи хранятся в `localStorage` под ключом `taskflow_tracker_tasks`; сброс — через DevTools.
- `.env`, `node_modules/`, `dist/` и `.DS_Store` исключены из репозитория через `.gitignore`.
