# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# TaskFlow

TaskFlow — простой и красивый локальный Kanban для личного использования и прототипирования рабочих процессов.

Почему TaskFlow
- Лёгкий и быстрый старт — ничего не надо поднимать, всё хранится в браузере.
- Инструменты для создания досок, колонок, задач и управления правами доступа (встроенная заглушка приглашений).
- Хорошая база для дальнейшего развития: можно подключить бэкенд, синхронизацию и разграничение прав.

Стек
- React + TypeScript
- Vite
- Zustand (локальный стейт)
- React Router
- Чистый CSS (по компонентам)

Функции
- Аутентификация (регистрация/вход) — данные хранятся в `localStorage`
- Доски (Boards): создание, просмотр и редактирование
- Колонки и задачи: добавление, удаление, перетаскивание (drag & drop)
- Права доступа: владелец доски + администраторы; зрители могут запросить права
- Приглашение по ссылке: при открытии ссылки пользователь получает права администратора (заглушка)
- Настройки доски: поменять название, цвет фона, тёмную тему, управлять администраторами
- Редактирование профиля: имя, аватар, биография

Ключевые файлы
- `src/store/authStore.ts` — управление пользователем
- `src/store/boardStore.ts` — логика досок, колонок, задач и прав
- `src/pages/DashboardPage` — главный экран со списком досок
- `src/pages/BoardPage` — интерфейс доски, колонки, таски
- `src/shared` — общие компоненты: хедер, модалки, профиль, приглашения

Установка и запуск
1. Установите Node.js (рекомендую 16+).
2. В папке проекта установите зависимости:

```bash
npm install
```

3. Запустите дев-сервер:

```bash
npm run dev
```

4. Откройте адрес, который выведет Vite (обычно `http://localhost:5173`).

Примечания
- Данные приложения сохраняются в `localStorage` (ключи: `user`, `taskflow_boards`).
- При первом запуске создаются две доски: одна — ваша (владелец), вторая — чужая (для тестирования прав).
- Механика приглашений реализована как заглушка: при запросе/открытии приглашения права выдаются автоматически.

