
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';



 const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',        
    maxWidth: '400px',    
    padding: '1rem',      
  },
};


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
  const [modalIsOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    task: null,
    column: '',
  });

  let subtitle;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = '#16610E';
  }

  function closeModal() {
    setIsOpen(false);
  }


  const addTask = () => {
    if (!title || !description) return alert("Please provide both a title and a description.");
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
    closeModal();
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

  useEffect(() => {
    const handleClick = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="p-4 lg:p-8 bg-white min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold mb-6">To Do List App</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(COLUMN_TYPES).map((key) => {
          const column = COLUMN_TYPES[key];
          return (
            <div key={column} className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-3">{column}</h2>
              <div className="space-y-3">
                {tasks[column].map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white border-l-4 ${STATUS_COLORS[task.status]} p-3 rounded shadow cursor-pointer hover:shadow-lg transition`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        visible: true,
                        x: e.pageX,
                        y: e.pageY,
                        task,
                        column,
                      });
                    }}
                  >
                    <div className="text-sm text-gray-600">#{task.id.slice(0, 4)}</div>
                    <div className="font-semibold text-lg">{task.title}</div>
                    <div className="text-sm text-gray-700">{task.description}</div>
                    {column === COLUMN_TYPES.ONGOING && (
                      <>
                        <h2 className='text-sm text-gray-700'>Due date :</h2>
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
                    {contextMenu.visible && (
                      <ul
                        className="absolute bg-white shadow-lg border rounded w-40 z-50"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
                      >
                        <li className="relative group px-3 py-2 text-gray-700 font-semibold hover:bg-gray-100 cursor-default border-b">
                          Move to
                          <span className="absolute right-3">›</span>

                          {/* Submenu */}
                          <ul className="absolute left-full top-0 mt-0 ml-0 hidden group-hover:block bg-white shadow-lg border rounded w-32 z-50">
                            {Object.values(COLUMN_TYPES)
                              .filter((c) => c !== contextMenu.column)
                              .map((option) => (
                                <li
                                  key={option}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    moveTask(contextMenu.task, contextMenu.column, option);
                                    setContextMenu({ ...contextMenu, visible: false });
                                  }}
                                >
                                  {option}
                                </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <button onClick={openModal} className="text-sm text-gray-500 italic">+ Add a card</button>
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div className='flex justify-between mb-4'>
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Create New Task</h2>
                    <button onClick={closeModal}>X</button>
                  </div>
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
                </Modal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanTodoApp;
