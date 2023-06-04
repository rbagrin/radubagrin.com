import React from "react";

import "./modal.css";
export const InfoModal = ({ isOpen, onClose, children }) => {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div>{children}</div>
      </div>
    </div>
  );
};
