import React from 'react';
import Modal from 'react-modal';

const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Error Modal"
    >
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <button onClick={onClose}>Cerrar</button>
    </Modal>
  );
};

export default ErrorModal;