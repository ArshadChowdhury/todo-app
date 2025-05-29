import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { STATUS_COLORS } from '../assets/constants';

function TaskCard({ task, column, setContextMenu }) {
  const [dueTime, setDueTime] = useState('');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id, data: { task, column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = dueTime && new Date(dueTime) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border-l-4 ${STATUS_COLORS[task.status]} p-3 rounded shadow hover:shadow-lg transition cursor-pointer`}
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

      {column === 'Ongoing' && (
        <div className="mt-2">
          <h2 className="text-sm text-gray-700">Due date:</h2>
          <input
            type="datetime-local"
            className="w-full mt-1 border border-gray-300 text-sm px-2 py-1 rounded"
            onChange={(e) => setDueTime(e.target.value)}
          />
          {isOverdue && (
            <div className="text-red-500 text-xs font-medium mt-1">⚠️ Overdue</div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
