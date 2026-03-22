import React from 'react';

const UserTypeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Choose Account Type</h2>
        <p className="text-gray-600 mb-6 text-center">Please select how you want to register</p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect('tutor')}
            className="w-full py-3 px-4 bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition"
          >
            Register as Tutor
          </button>
          <button
            onClick={() => onSelect('parent')}
            className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Register as Parent
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeModal; 