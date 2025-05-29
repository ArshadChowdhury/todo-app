import Modal from 'react-modal';

Modal.setAppElement('#root');

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
        padding: '0',
        border: 'none',
        background: 'none',
    },
};


function TaskModal({ isOpen, closeModal, title, setTitle, description, setDescription, addTask }) {
    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} contentLabel="New Task Modal">
            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg border border-gray-500 dark:border-none">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-green-700 dark:text-green-400">Create New Task</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-2 py-1"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded px-2 py-1"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                        onClick={addTask}
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default TaskModal;
