import { Home, Inbox, Info } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function RightNav() {
  return (
    <div className="right-nav">
      <nav>
        <NavLink to="/">
          <Home />
        </NavLink>
        <NavLink to="/inbox">
          <Inbox />
        </NavLink>
        <NavLink to="/aboutUs">
          <Info />
        </NavLink>

        {/* <ArrowRightCircle /> */}
      </nav>
    </div>
  );
}
