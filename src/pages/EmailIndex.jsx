import { useEffect, useState } from "react";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";
import { Outlet, useParams, useSearchParams } from "react-router-dom";
import { EmailComposeModal } from "../components/EmailComposeModal.jsx";
import { RightNav } from "../components/RightNav.jsx";

export function EmailIndex({ filterBy, isMenuVisible, toggleMenu }) {
  const [emails, setEmails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const handleSubmit = async (subject, message, to) => {
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
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error", err);
    }
  };

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

  if (!emails) return <div className="loading">Loading...</div>;

  return (
    <section className="email-index">
      <SideNav
        currentNav={params.folder}
        emails={emails}
        isMenuVisible={isMenuVisible}
        toggleMenu={toggleMenu}
      />
      <section className="inbox-container">
        {/* render here pages - email list / starred / drafts / sent etc.  */}
        {params.emailId ? <Outlet /> : <EmailList emails={emails} />}
      </section>
      <RightNav />

      {searchParams.get("compose") && (
        <EmailComposeModal
          currentNav={params.folder}
          handleSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
