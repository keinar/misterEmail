import { useNavigate } from 'react-router-dom';

export function ItemNav({
  to,
  icon,
  label,
  isActive,
  inboxCount,
  setIsMenuVisible,
}) {
  const navigate = useNavigate();

  function navigateToPage() {
    setIsMenuVisible(false);
    navigate(to);
  }

  return (
    <div onClick={() => navigateToPage()}>
      <ul className={`${label.toLowerCase()} ${isActive ? 'active' : ''}`}>
        {icon}
        {label}
        {isActive && <span>{inboxCount ? inboxCount : 'Empty'}</span>}
      </ul>
    </div>
  );
}
