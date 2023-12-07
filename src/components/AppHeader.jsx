import { NavLink } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="app-header">
      <section className="container">
        <NavLink to="/">Mister Email</NavLink>

        <nav>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/email">Email</NavLink>
        </nav>
      </section>
    </header>
  );
}
