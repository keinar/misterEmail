import { NavLink } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="app-header">
      <section className="container">
        <h1>Mister Email</h1>

        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/email-inbox">Email-Inbox</NavLink>
        </nav>
      </section>
    </header>
  );
}
