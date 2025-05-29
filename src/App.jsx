import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { COLUMN_TYPES, STATUS_COLORS } from './assets/constants';
import TaskColumn from './components/TaskColumn';
import TaskModal from './components/TaskModal';
import ContextMenu from './components/ContextMenu';

const initialState = {
  [COLUMN_TYPES.NEW]: [],
  [COLUMN_TYPES.ONGOING]: [],
  [COLUMN_TYPES.DONE]: [],
};

function KanbanTodoApp() {
  const [tasks, setTasks] = useState(initialState);
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
 

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    const hideMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, []);

  const handleDragStart = (event) => {
  setActiveTask(event.active.data.current.task);
};


  const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) {
    setActiveTask(null);
    return;
  }

  const fromColumn = active.data.current.column;
  const toColumn = over.data.current.column;

  if (fromColumn === toColumn) {
    const updatedTasks = [...tasks[fromColumn]];
    const oldIndex = updatedTasks.findIndex((t) => t.id === active.id);
    const newIndex = updatedTasks.findIndex((t) => t.id === over.id);
    const [movedTask] = updatedTasks.splice(oldIndex, 1);
    updatedTasks.splice(newIndex, 0, movedTask);

    setTasks({
      ...tasks,
      [fromColumn]: updatedTasks,
    });
  } else {
    moveTask(active.data.current.task, fromColumn, toColumn);
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

  return (
    <div className="p-4 lg:p-8 bg-white min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold mb-6">To Do List App</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        closeModal={() => setIsOpen(false)}
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
    </div>
  );
}

export default KanbanTodoApp;
