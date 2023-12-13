import { SendHorizonal, X } from "lucide-react";
import { emailService } from "../services/email.service";
import { useEffect, useState } from "react";

export function EmailComposeModal({ onComposeModalChange }) {
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
            required
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
            required
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
          <button type="submit" name="send" className="send-button">
            <SendHorizonal size={20} />
          </button>
        </fieldset>
      </form>
    </section>
  );
}
