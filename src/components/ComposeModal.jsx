import { Send, X } from "lucide-react";
import { emailService } from "../services/email.service";
import { useEffect, useState } from "react";
import { utilService } from "../services/util.service";

export function ComposeModal({ onComposeModalChange, loadEmails }) {
  const [userEmail, setUserEmail] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function openComposeModal() {
    onComposeModalChange(false);
  }

  useEffect(() => {
    async function fetchUserEmail() {
      const userEmailData = await emailService.getDemoUser();
      setUserEmail(userEmailData[0].email);
    }

    fetchUserEmail();
  }, []);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const emailData = await emailService.createEmail(
        subject,
        message,
        false, // isRead
        false, // isStarred
        userEmail,
        to
      );
      // Clear the form fields after submission
      setTo("");
      setSubject("");
      setMessage("");
      loadEmails();
    } catch (err) {
      console.log("Error", err);
    }
  }

  return (
    <section className="compose-modal">
      <header>
        <h1>New Message</h1>
        <X size={16} onClick={openComposeModal} className="close" />
      </header>
      <form onSubmit={handleSubmit}>
        <fieldset className="from">
          <label htmlFor="from">From:</label>
          <input
            type="email"
            id="from"
            name="from"
            value={userEmail}
            readOnly
          />
        </fieldset>

        <fieldset className="to">
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            name="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </fieldset>
        <fieldset className="subject">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </fieldset>
        <fieldset className="message">
          <textarea
            id="message"
            name="message"
            rows="11"
            cols="60"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </fieldset>

        <fieldset className="submit">
          <input type="submit" name="send" value="Send" />
        </fieldset>
      </form>
    </section>
  );
}
