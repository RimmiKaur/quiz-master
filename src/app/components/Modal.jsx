import React from "react";

const Modal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md fade-in">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center animate-fade-in opacity-80">
        <h2 className={`text-xl font-bold mb-2 text-green-600 ${title=='Incorrect!' ? "text-red-600" : "text-blue-600"}`}>{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`${title==="Time's Up!" ? "hidden" : "block"} px-4 py-2 bg-blue-500 text-white rounded-md mx-auto hover:bg-blue-700 transition-all`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
