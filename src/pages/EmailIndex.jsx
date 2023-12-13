import { useEffect, useState } from "react";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { EmailComposeModal } from "../components/EmailComposeModal.jsx";
import { RightNav } from "../components/RightNav.jsx";

export function EmailIndex({ filterBy, isMenuVisible, toggleMenu }) {
  const location = useLocation();
  const [emails, setEmails] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    loadEmails();
  }, [filterBy, emails]);

  async function loadEmails() {
    try {
      const loadedEmails = await emailService.query(filterBy);
      setEmails(loadedEmails);
    } catch (err) {
      console.error("error: ", err);
    }
  }

  if (!emails) return <div>Loading...</div>;
  const isEmailDetailsPage = location.pathname.includes("/email/");

  const currentNav = location.pathname.includes("/email/sent")
    ? "sent"
    : location.pathname.includes("/email/drafts")
    ? "drafts"
    : location.pathname.includes("/email/bin")
    ? "bin"
    : "inbox";

  function handleComposeModalChange(newValue) {
    setIsComposeOpen(newValue);
  }

  return (
    <section className="email-index">
      <SideNav
        currentNav={currentNav}
        emails={emails}
        onComposeModalChange={handleComposeModalChange}
        isMenuVisible={isMenuVisible}
        toggleMenu={toggleMenu}
      />

      <section className="inbox-container">
        {/* render here pages - email list / starred / drafts / sent etc.  */}
        {isEmailDetailsPage ? <Outlet /> : <EmailList emails={emails} />}
      </section>

      <RightNav />

      {isComposeOpen && (
        <EmailComposeModal onComposeModalChange={handleComposeModalChange} />
      )}
    </section>
  );
}
