export default function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`modal-overlay ${!open ? "modal-hidden" : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
        style="overflow-y: scroll;"
      >
        {children}
      </div>
    </div>
  );
}
