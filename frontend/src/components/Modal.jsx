import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-primary/20" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow-lg p-14 transition-all ${
          open ? "scale-100 opacity-100 " : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 cursor-pointer"
        >
          <IoMdCloseCircle color="red" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
