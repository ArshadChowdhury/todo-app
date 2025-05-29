import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

function TaskColumn({ column, tasks, setContextMenu, openModal }) {
  const { setNodeRef } = useDroppable({
    id: column, // unique ID for droppable area
  });

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-lg p-4 shadow-md relative">
      <h2 className="text-lg font-semibold mb-3">{column}</h2>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              column={column}
              onRightClick={(e, t, col) => {
                e.preventDefault();
                setContextMenu({
                  visible: true,
                  x: e.pageX,
                  y: e.pageY,
                  task: t,
                  column: col,
                });
              }}
            />
          ))}
        </div>
      </SortableContext>

      <button onClick={openModal} className="text-sm text-gray-500 italic mt-3 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add a card
      </button>
    </div>
  );
}

export default TaskColumn;
