
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const COLUMN_TYPES = {
  NEW: 'New',
  ONGOING: 'Ongoing',
  DONE: 'Done',
};

const STATUS_COLORS = {
  New: 'border-blue-500',
  Ongoing: 'border-orange-500',
  Done: 'border-green-500',
};

const initialState = {
  [COLUMN_TYPES.NEW]: [],
  [COLUMN_TYPES.ONGOING]: [],
  [COLUMN_TYPES.DONE]: [],
};

function KanbanTodoApp() {
  const [tasks, setTasks] = useState(initialState);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');

  const addTask = () => {
    if (!title || !description) return;
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
  };

  const moveTask = (task, from, to) => {
    const updatedFrom = tasks[from].filter((t) => t.id !== task.id);
    const updatedTo = [...tasks[to], { ...task, status: to }];
    setTasks((prev) => ({
      ...prev,
      [from]: updatedFrom,
      [to]: updatedTo,
    }));
  };

  const checkOverdue = (task, dueTime) => {
    const now = new Date();
    return new Date(dueTime) < now;
  };

  return (
    <div className="p-8 bg-white min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold mb-6">Demo purpose only</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(COLUMN_TYPES).map((key) => {
          const column = COLUMN_TYPES[key];
          return (
            <div key={column} className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-3">{column}</h2>
              {column === COLUMN_TYPES.NEW && (
                <div className="mb-4 space-y-2">
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700" onClick={addTask}>
                    Add Task
                  </button>
                </div>
              )}
              <div className="space-y-3">
                {tasks[column].map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white border-l-4 ${STATUS_COLORS[task.status]} p-3 rounded shadow cursor-pointer hover:shadow-lg transition`} 
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const options = Object.values(COLUMN_TYPES).filter((c) => c !== column);
                      const selection = window.prompt(`Move to: ${options.join(', ')}`);
                      if (options.includes(selection)) moveTask(task, column, selection);
                    }}
                  >
                    <div className="text-sm text-gray-600">#{task.id.slice(0, 4)}</div>
                    <div className="font-semibold text-lg">{task.title}</div>
                    <div className="text-sm text-gray-700">{task.description}</div>
                    {column === COLUMN_TYPES.ONGOING && (
                      <>
                        <input
                          type="datetime-local"
                          className="w-full mt-2 border border-gray-300 text-sm px-2 py-1 rounded"
                          onChange={(e) => setDueTime(e.target.value)}
                        />
                        {dueTime && checkOverdue(task, dueTime) && (
                          <div className="text-red-500 text-xs font-medium mt-1">⚠️ Overdue</div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              {tasks[column].length === 0 && (
                <div className="text-sm text-gray-500 italic">+ Add a card</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanTodoApp;
