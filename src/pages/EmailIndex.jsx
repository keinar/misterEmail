import { useEffect, useState } from "react";
import { EmailFilter } from "../components/EmailFilter";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDeviceDetect } from "../components/useDeviceDetect.js";
import { ComposeModal } from "../components/ComposeModal.jsx";

export function EmailIndex() {
  const location = useLocation();
  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
  const [showNavBar, setShowNavBar] = useState(-400);
  const { isMobile } = useDeviceDetect();
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    loadEmails();
  }, [filterBy, emails]);

  async function loadEmails() {
    try {
      const emails = await emailService.query(filterBy);
      setEmails(emails);
    } catch (err) {
      console.error("error: ", err);
    }
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }));
  }

  if (!emails) return <div>Loading...</div>;
  const isEmailDetailPage = location.pathname.includes("/email/");
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
        isMobile={isMobile}
        emails={emails}
        onComposeModalChange={handleComposeModalChange}
      />
      <section className="inbox-container">
        <EmailFilter
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          setShowNavBar={setShowNavBar}
          isMobile={isMobile}
        />
        <br></br>
        {isEmailDetailPage ? <Outlet /> : <EmailList emails={emails} />}
      </section>
      {isComposeOpen && (
        <ComposeModal onComposeModalChange={handleComposeModalChange} />
      )}
    </section>
  );
}
