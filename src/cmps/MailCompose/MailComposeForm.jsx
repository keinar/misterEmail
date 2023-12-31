import { SendHorizonal, X } from 'lucide-react';
import { mailService } from '../../services/mailService';
import { useEffect, useState } from 'react';

export function MailComposeForm({
  handleSubmit,
  newMail,
  setNewMail,
  userMail,
}) {
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // async function saveDraft() {
  //     //   return await mailService.save(newMail);
  //     // }
  //     // // saveDraft();
  //     console.log(newMail);
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, [newMail]);

  const submit = e => {
    e.preventDefault();
    handleSubmit(e);
  };

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewMail(prevMail => ({ ...prevMail, [name]: value }));
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="from">
        <label htmlFor="from">From:</label>
        <input type="email" id="from" name="from" value={userMail} readOnly />
      </fieldset>

      <fieldset className="to">
        <label htmlFor="to">To:</label>
        <input
          type="email"
          id="to"
          name="to"
          value={newMail.to}
          onChange={handleChange}
          required
        />
      </fieldset>
      <fieldset className="subject">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={newMail.subject}
          onChange={handleChange}
        />
      </fieldset>
      <fieldset className="message">
        <textarea
          id="message"
          name="message"
          value={newMail.message}
          onChange={handleChange}
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
