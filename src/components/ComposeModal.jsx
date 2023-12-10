import { Send, X } from "lucide-react";
import { emailService } from "../services/email.service";
import { useEffect, useState } from "react";

export function ComposeModal({ onComposeModalChange }) {
  const [userEmail, setUserEmail] = useState("");
  function openComposeModal() {
    onComposeModalChange(false);
  }

  useEffect(() => {
    async function fetchUserEmail() {
      const userEmail = await emailService.getDemoUser();
      setUserEmail(userEmail[0].email);
    }

    fetchUserEmail();
  }, []);

  return (
    <section className="compose-modal">
      <header>
        <h1>New Message</h1>
        <X size={16} onClick={openComposeModal} className="close" />
      </header>
      <form>
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
          <input type="email" id="to" name="to" />
        </fieldset>
        <fieldset className="subject">
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" />
        </fieldset>
        <fieldset className="message">
          <textarea
            id="message"
            name="message"
            rows="11"
            cols="60"
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
          />
        </fieldset>

        <fieldset className="submit">
          <input type="submit" name="send" value="Send" />
        </fieldset>
      </form>
    </section>
  );
}
