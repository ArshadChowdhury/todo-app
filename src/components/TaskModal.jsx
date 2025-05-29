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
    padding: '1.5rem',      
  },
};


function TaskModal({ isOpen, closeModal, title, setTitle, description, setDescription, addTask }) {
    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} contentLabel="New Task Modal">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-green-700">Create New Task</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-black">X</button>
            </div>
            <div className="space-y-3">
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
                <button
                    className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                    onClick={addTask}
                >
                    Add Task
                </button>
            </div>
        </Modal>
    );
}

export default TaskModal;
