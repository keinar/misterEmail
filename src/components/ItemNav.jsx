import { NavLink } from "react-router-dom";

export function NavItem({ to, icon, label, isActive, emails, inboxCount }) {
  return (
    <NavLink to={to}>
      <ul className={`${label.toLowerCase()} ${isActive ? "active" : ""}`}>
        {icon}
        {label}
        {label === "Inbox" && <span>{inboxCount ? inboxCount : "Empty"}</span>}
      </ul>
    </NavLink>
  );
}
