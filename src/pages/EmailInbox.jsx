import { useEffect, useState } from "react";
import { EmailFilter } from "../components/EmailFilter";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";

export function EmailInbox() {
  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());

  useEffect(() => {
    loadEmails();
  }, [filterBy]);

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

  return (
    <>
      <h1>Email Inbox</h1>
      <EmailFilter filterBy={{ filterBy }} onSetFilter={onSetFilter} />
      <EmailList emails={emails} />
    </>
  );
}
