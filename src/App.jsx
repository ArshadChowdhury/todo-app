import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { COLUMN_TYPES } from './assets/constants';
import TaskColumn from './components/TaskColumn';
import TaskModal from './components/TaskModal';
import ContextMenu from './components/ContextMenu';


const initialState = {
  [COLUMN_TYPES.NEW]: [],
  [COLUMN_TYPES.ONGOING]: [],
  [COLUMN_TYPES.DONE]: [],
};

function KanbanTodoApp() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('kanbanTasks');
    return stored ? JSON.parse(stored) : initialState;
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    task: null,
    column: '',
  });
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );



  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const hideMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);


  const handleDragStart = (event) => {
    const task = event.active.data.current.task;
    setActiveTask(task);
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveTask(null);
      return;
    }

    const fromColumn = active.data.current.column;
    let toColumn = over.id;

    // If over.id is not a column, find which column the task is in
    if (!Object.values(COLUMN_TYPES).includes(toColumn)) {
      toColumn = Object.keys(tasks).find((col) =>
        tasks[col].some((task) => task.id === over.id)
      );
    }

    if (fromColumn && toColumn && fromColumn !== toColumn) {
      moveTask(activeTask, fromColumn, toColumn);
    }

    setActiveTask(null);
  };


  const addTask = () => {
    if (!title || !description) return alert('Please provide both a title and a description.');
    const newTask = {
      id: uuidv4(),
      title,
      description,
      status: COLUMN_TYPES.NEW,
      createdAt: new Date(),
    };
    setTasks((prev) => ({
      ...prev,
      [COLUMN_TYPES.NEW]: [newTask, ...prev[COLUMN_TYPES.NEW]],
    }));
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  const moveTask = (task, from, to) => {
    const updatedFrom = tasks[from].filter((t) => t.id !== task.id);
    const updatedTo = [...tasks[to], { ...task, status: to }];
    setTasks({
      ...tasks,
      [from]: updatedFrom,
      [to]: updatedTo,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
  }

  return (
    <section className="p-4 lg:p-8 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <header className='flex items-center justify-between'>
        <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          To Do List App</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="mb-4 px-4 py-2 text-sm border rounded"
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

      </header>
      {Object.values(tasks).flat().length > 1 && (
        <button
          onClick={() => {
            localStorage.removeItem('kanbanTasks');
            setTasks(initialState);
          }}
          className="text-sm text-red-500 underline mb-2"
        >
          Clear All Tasks
        </button>
      )}


      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.keys(COLUMN_TYPES).map((key) => {
            const column = COLUMN_TYPES[key];
            return (
              <TaskColumn
                key={column}
                column={column}
                tasks={tasks[column]}
                setContextMenu={setContextMenu}
                openModal={() => setIsOpen(true)}
              />
            );
          })}
        </div>
      </DndContext>

      <TaskModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        addTask={addTask}
      />

      {contextMenu.visible && (
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          moveTask={moveTask}
        />
      )}

    </section>
  );
}

export default KanbanTodoApp;
