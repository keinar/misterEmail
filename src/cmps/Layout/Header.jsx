import { NavLink } from 'react-router-dom';
import logo from '../../assets/imgs/logo_gmail.png';
import userLogo from '../../assets/imgs/userLogo.jpg';
import { mailService } from '../../services/mailService';
import { useState } from 'react';
import { AlignJustify } from 'lucide-react';
import { MailSearchFilter } from '../MailFilter/MailSearchFilter';

export function Header({ filterBy, onSetFilter, toggleMenu }) {
  const [userName] = useState(mailService.getLoggedInUser().fullname);

  let walcomeMessage = 'Welcome ';
  if (userName) {
    walcomeMessage += userName;
  }
  return (
    <header className="app-header">
      <section className="container">
        <div className="mobile-menu" onClick={() => toggleMenu()} hidden>
          <AlignJustify />
        </div>

        <div className="app-logo">
          <NavLink to="/inbox/">
            <img src={logo} alt="Mister Mail" className="logoME" />
          </NavLink>
        </div>

        <div className="search-filter">
          <MailSearchFilter filterBy={filterBy} onSetFilter={onSetFilter} />
        </div>

        <div className="user-settings">
          <img
            src={userLogo}
            alt="User Logo"
            className="user-logo"
            title={walcomeMessage}
          />
        </div>
      </section>
    </header>
  );
}
