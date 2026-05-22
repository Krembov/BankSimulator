import './EventModal.css';

interface EventModalProps {
  message: string;
  type: 'good' | 'bad' | 'info';
  onClose: () => void;
}

export default function EventModal({ message, type, onClose }: EventModalProps) {
  const icons = { good: '🎉', bad: '😬', info: 'ℹ️' };
  const titles = { good: 'Отлично!', bad: 'О нет!', info: 'Новости рынка' };
  const btnClass = type === 'good' ? 'btn-success' : type === 'bad' ? 'btn-danger' : 'btn-primary';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">{icons[type]}</div>
        <h2>{titles[type]}</h2>
        <p>{message}</p>
        <button className={btnClass} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
