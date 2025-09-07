
export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        // Main overlay
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" 
            onClick={onClose} // Close modal when clicking the overlay
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative"
                onClick={e => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl font-light"
                    >
                        &times;
                    </button>
                </div>
                {/* Body (where the form will go) */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
