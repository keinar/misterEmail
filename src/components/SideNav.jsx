import {
  File,
  Inbox,
  MailPlus,
  SendHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { emailService } from "../services/email.service";
import { NavItem } from "./ItemNav";
import { useNavigate } from "react-router-dom";

export function SideNav({
  currentNav,
  emails,
  isMenuVisible,
  toggleMenu,
  inboxCount,
}) {
  const navigate = useNavigate();

  function handleOpenCompose() {
    navigate(`/${currentNav}?compose=new`);
  }

  const navItems = [
    {
      to: "/",
      label: "Inbox",
      icon: (
        <Inbox
          size={20}
          stroke={currentNav === "inbox" ? "black" : "#484A49"}
        />
      ),
    },
    {
      to: "/starred",
      label: "Starred",
      icon: (
        <Star
          size={20}
          stroke={currentNav === "starred" ? "black" : "#484A49"}
        />
      ),
    },
    {
      to: "/sent",
      label: "Sent",
      icon: (
        <SendHorizontal
          size={20}
          stroke={currentNav === "sent" ? "black" : "#484A49"}
        />
      ),
    },
    {
      to: "/drafts",
      label: "Drafts",
      icon: (
        <File
          size={20}
          stroke={currentNav === "drafts" ? "black" : "#484A49"}
        />
      ),
    },
    {
      to: "/bin",
      label: "Bin",
      icon: (
        <Trash2 size={20} stroke={currentNav === "bin" ? "black" : "#484A49"} />
      ),
    },
  ];

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

  const navStyles = {
    left: isMenuVisible ? "0" : "-300px",
  };

  return (
    <nav className="side-nav" style={navStyles}>
      {isMenuVisible && <X onClick={toggleMenu} />}

      <button className="email-compose" onClick={handleOpenCompose}>
        <MailPlus size={20} /> Compose
      </button>

      {navItems.map((item) => (
        <NavItem
          key={item.label}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={currentNav === item.label.toLowerCase()}
          emails={emails}
          inboxCount={inboxCount}
        />
      ))}
    </nav>
  );
}
