const DrinkModal = ({ drink, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        {/* ... existing modal content ... */}
      </div>
    </div>
  );
};

export default DrinkModal; 