import { useEffect, useState } from "react";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ComposeModal } from "../components/ComposeModal.jsx";
import { RightNav } from "../components/RightNav.jsx";

export function EmailIndex({ filterBy }) {
  const location = useLocation();
  const [emails, setEmails] = useState(null);
  const [showNavBar, setShowNavBar] = useState(-400);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    loadEmails();
  }, [filterBy]);

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
        showNavBar={showNavBar}
        setShowNavBar={setShowNavBar}
        emails={emails}
        onComposeModalChange={handleComposeModalChange}
      />

      <section className="inbox-container">
        {isEmailDetailsPage ? (
          <Outlet />
        ) : (
          <EmailList
            emails={emails}
            onComposeModalChange={handleComposeModalChange}
          />
        )}
      </section>

      <RightNav />

      {isComposeOpen && (
        <ComposeModal onComposeModalChange={handleComposeModalChange} />
      )}
    </section>
  );
}
