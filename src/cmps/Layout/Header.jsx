import { NavLink, useParams } from 'react-router-dom';
import logo from '../../assets/imgs/logo_gmail.png';
import userLogo from '../../assets/imgs/userLogo.jpg';
import { mailService } from '../../services/mailService';
import { useEffect, useState } from 'react';
import { AlignJustify } from 'lucide-react';
import { MailFilter } from '../MailFilter/MailFilter';

export function Header({
  filterBy,
  onSetFilter,
  setIsMenuVisible,
  isMenuVisible,
}) {
  const [userName, setUserName] = useState(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    async function getUserName() {
      try {
        setUserName(await mailService.getDemoUser());
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    }

    getUserName();
  }, []);

  let WCuserName = 'Welcome ';
  if (userName && userName[0].fullname) {
    WCuserName += userName[0].fullname;
  }
  return (
    <header className="app-header">
      <section className="container">
        <div className="mobileMenu" onClick={toggleMenu} hidden>
          <AlignJustify />
        </div>

        <div className="app-logo">
          <NavLink to="/inbox/">
            <img src={logo} alt="Mister Email" className="logoME" />
          </NavLink>
        </div>

        <div className="search-filter">
          <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
        </div>

        <div className="user-settings">
          <img
            src={userLogo}
            alt="User Logo"
            className="user-logo"
            title={WCuserName}
          />
        </div>
      </section>
    </header>
  );
}