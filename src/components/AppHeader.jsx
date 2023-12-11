import { NavLink } from "react-router-dom";
import logo from "../assets/imgs/logoMe.png";
import { useDeviceDetect } from "./useDeviceDetect";
import userLogo from "../assets/imgs/userLogo.jpg";
import { emailService } from "../services/email.service";
import { useEffect, useState } from "react";

export function AppHeader() {
  const { isMobile } = useDeviceDetect();
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
        <NavLink to="/">
          <img
            src={logo}
            alt="Mister Email"
            width={isMobile ? 60 : 80}
            className="logoME"
          />
        </NavLink>

        <nav>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/email">Email</NavLink>
        </nav>
        <img
          src={userLogo}
          alt="User Logo"
          className="user-logo"
          title={WCuserName}
        />
      </section>
    </header>
  );
}
