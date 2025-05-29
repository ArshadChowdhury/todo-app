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
            className={`bg-white border-l-4 ${STATUS_COLORS[task.status]} p-3 rounded shadow cursor-pointer hover:shadow-lg transition dark:bg-gray-400`}
        >
            <div className="text-sm text-gray-600 dark:text-gray-200">#{task.id.slice(0, 4)}</div>
            <div className="font-semibold text-lg text-gray-600 dark:text-gray-50">{task.title}</div>
            <div className="text-sm text-gray-700 dark:text-gray-50">{task.description}</div>

            {column === COLUMN_TYPES.ONGOING && (
                <>
                    <h2 className='text-sm text-gray-700 mt-2'>Due date :</h2>
                    <input
                        type="datetime-local"
                        className="w-full mt-2 border border-gray-300 text-sm px-2 py-1 rounded 
             dark:border-gray-600 dark:bg-gray-800 dark:text-white 
             bg-white text-gray-900"
                        onChange={(e) => setDueTime(e.target.value)}
                    />
                    {dueTime && checkOverdue(dueTime) && (
                        <div className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1 dark:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>

                            Overdue</div>
                    )}
                </>
            )}

        </div>


    );
}

export default TaskCard;
