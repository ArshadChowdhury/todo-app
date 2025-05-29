import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

function TaskColumn({ column, tasks, setContextMenu, openModal }) {
  const { setNodeRef } = useDroppable({
    id: column, // Important: unique ID for droppable area
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

      <button onClick={openModal} className="text-sm text-gray-500 italic mt-3">
        + Add a card
      </button>
    </div>
  );
}

export default TaskColumn;
