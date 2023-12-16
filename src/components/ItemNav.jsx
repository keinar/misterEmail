import { NavLink } from "react-router-dom";

export function NavItem({ to, icon, label, isActive, emails }) {
  return (
    <NavLink to={to}>
      <ul className={`${label.toLowerCase()} ${isActive ? "active" : ""}`}>
        {icon}
        {label}
        {label === "Inbox" && (
          <span>{emails.length ? emails.length : "Empty"}</span>
        )}
      </ul>
    </NavLink>
  );
}
