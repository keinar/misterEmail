import { useEffect, useState } from "react";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { EmailComposeModal } from "../components/EmailComposeModal.jsx";
import { RightNav } from "../components/RightNav.jsx";

export function EmailIndex({ filterBy, isMenuVisible, toggleMenu }) {
  const [emails, setEmails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [inboxCount, setInboxCount] = useState(0);
  const [to, setTo] = useState("");
  const params = useParams();
  const location = useLocation();

  async function handleSubmit(e, subject, message, to, userEmail) {
    try {
      e.preventDefault();
      if (!message) {
        const userConfirmed = confirm(
          "Are you sure that you want to send an empty messsage?"
        );
        if (!userConfirmed) {
          return;
        }
      }
      const emailData = await emailService.createEmail(
        subject,
        message,
        false, // isRead
        false, // isStarred
        userEmail,
        to
      );
      // Clear the form fields after submission
      alert("Your message sent successfully");
      setSubject("");
      setMessage("");
      loadEmails();
    } catch (err) {
      console.error("Error", err);
    }
  }

  useEffect(() => {
    loadEmails();
  }, [filterBy, location]);

  async function loadEmails() {
    try {
      const loadedEmails = await emailService.query(filterBy);
      let filteredEmails;

      if (params.folder === "starred") {
        filteredEmails = loadedEmails.filter((email) => email.isStarred);
      } else if (params.folder === "inbox") {
        filteredEmails = loadedEmails;
      } else {
        filteredEmails = loadedEmails;
      }

      setEmails(filteredEmails);
      setInboxCount(loadedEmails.length);
    } catch (err) {
      console.error("error: ", err);
    }
  }
  if (!emails) return <div className="loading">Loading...</div>;

  return (
    <section className="email-index">
      <SideNav
        currentNav={params.folder}
        emails={emails}
        isMenuVisible={isMenuVisible}
        toggleMenu={toggleMenu}
        inboxCount={inboxCount}
      />
      <section className="inbox-container">
        {/* render here pages - email list / starred / drafts / sent etc.  */}
        {params.emailId ? (
          <Outlet />
        ) : (
          <EmailList
            emails={emails.filter((email) =>
              filterBy.status === "starred" ? email.isStarred : true
            )}
            loadEmails={loadEmails}
          />
        )}
      </section>
      <RightNav />

      {searchParams.get("compose") && (
        <EmailComposeModal
          currentNav={params.folder}
          handleSubmit={handleSubmit}
          subject={subject}
          message={message}
          setMessage={setMessage}
          setSubject={setSubject}
          to={to}
          setTo={setTo}
          loadEmails={loadEmails}
        />
      )}
    </section>
  );
}