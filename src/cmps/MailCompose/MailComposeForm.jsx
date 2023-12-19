import { SendHorizonal, X } from 'lucide-react';
import { mailService } from '../../services/mailService';
import { useEffect, useState } from 'react';

export function MailComposeForm({
  handleSubmit,
  message,
  subject,
  setSubject,
  setMessage,
  to,
  setTo,
}) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function fetchUserEmail() {
      const userEmailData = await mailService.getDemoUser();
      setUserEmail(userEmailData[0].email);
    }

    fetchUserEmail();
  }, []);

  const submit = e => {
    e.preventDefault();
    handleSubmit(e, subject, message, to, userEmail);
    setTo('');
  };

  return (
    <form onSubmit={submit}>
      <fieldset className="from">
        <label htmlFor="from">From:</label>
        <input type="email" id="from" name="from" value={userEmail} readOnly />
      </fieldset>

      <fieldset className="to">
        <label htmlFor="to">To:</label>
        <input
          type="email"
          id="to"
          name="to"
          value={to}
          onChange={e => setTo(e.target.value)}
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
          onChange={e => setSubject(e.target.value)}
          required
        />
      </fieldset>
      <fieldset className="message">
        <textarea
          id="message"
          name="message"
          rows="15"
          cols="48"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </fieldset>

      <fieldset className="submit">
        <button type="submit" name="send" className="send-button">
          <SendHorizonal size={20} />
        </button>
      </fieldset>
    </form>
  );
}
