import { NavLink } from "react-router-dom";
import logo from "../assets/imgs/logo_gmail.png";
import userLogo from "../assets/imgs/userLogo.jpg";
import { emailService } from "../services/email.service";
import { useEffect, useState } from "react";
import { EmailFilter } from "./EmailFilter";
import { AlignJustify } from "lucide-react";

export function AppHeader({ filterBy, onSetFilter, toggleMenu }) {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    async function getUserName() {
      try {
        setUserName(await emailService.getDemoUser());
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    }

    getUserName();
  }, []);

  let WCuserName = "Welcome ";
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
          <NavLink to="/">
            <img src={logo} alt="Mister Email" className="logoME" />
          </NavLink>
        </div>

        <div className="search-filter">
          <EmailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
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
