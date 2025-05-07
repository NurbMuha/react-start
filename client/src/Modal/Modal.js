import React from 'react';

export default function Modal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Вы уверены, что хотите покинуть страницу?</h2>
        <div>
          <button onClick={onConfirm}>Да</button>
          <button onClick={onCancel}>Нет</button>
        </div>
      </div>
    </div>
  );
}