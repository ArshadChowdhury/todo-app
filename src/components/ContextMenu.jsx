import { COLUMN_TYPES } from '../assets/constants';

function ContextMenu({ contextMenu, setContextMenu, moveTask }) {
  return (
    <ul
      className="absolute bg-white shadow-lg border rounded w-40 z-50"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onMouseLeave={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
    >
      <li className="relative group px-3 py-2 text-gray-700 font-semibold hover:bg-gray-100 cursor-default border-b">
        Move to
        <span className="absolute right-3">›</span>
        <ul className="absolute left-full top-0 ml-0 hidden group-hover:block bg-white shadow-lg border rounded w-32 z-50">
          {Object.values(COLUMN_TYPES)
            .filter((c) => c !== contextMenu.column)
            .map((option) => (
              <li
                key={option}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  moveTask(contextMenu.task, contextMenu.column, option);
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
              >
                {option}
              </li>
            ))}
        </ul>
      </li>
    </ul>
  );
}

export default ContextMenu;
