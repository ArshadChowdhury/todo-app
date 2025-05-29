import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_COLORS, COLUMN_TYPES } from '../assets/constants';
import { useState } from 'react';

function TaskCard({ task, column, onRightClick, activeTask }) {
    const [dueTime, setDueTime] = useState();
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

    const checkOverdue = (dueTime) => {
        if (!dueTime) return false;
        const now = new Date();
        const dueDate = new Date(dueTime);
        return dueDate < now;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onContextMenu={(e) => onRightClick(e, task, column)}
            className={`bg-white border-l-4 ${STATUS_COLORS[task.status]} p-3 rounded shadow cursor-pointer hover:shadow-lg transition`}
        >
            <div className="text-sm text-gray-600">#{task.id.slice(0, 4)}</div>
            <div className="font-semibold text-lg">{task.title}</div>
            <div className="text-sm text-gray-700">{task.description}</div>

            {column === COLUMN_TYPES.ONGOING && (
                <>
                    <h2 className='text-sm text-gray-700 mt-2'>Due date :</h2>
                    <input
                        type="datetime-local"
                        className="w-full mt-2 border border-gray-300 text-sm px-2 py-1 rounded"
                        onChange={(e) => setDueTime(e.target.value)}
                    />
                    {dueTime && checkOverdue(dueTime) && (
                        <div className="text-red-500 text-xs font-medium mt-1">⚠️ Overdue</div>
                    )}
                </>
            )}

        </div>


    );
}

export default TaskCard;
