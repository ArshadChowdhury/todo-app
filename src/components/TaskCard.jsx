import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_COLORS } from '../assets/constants';

function TaskCard({ task, column, onRightClick, activeTask }) {
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
        </div>


    );
}

export default TaskCard;
