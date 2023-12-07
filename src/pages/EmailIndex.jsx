import { useEffect, useState } from "react";
import { EmailFilter } from "../components/EmailFilter";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";

export function EmailIndex() {
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
    <section className="email-index">
      <SideNav />
      <section>
        <EmailFilter filterBy={{ filterBy }} onSetFilter={onSetFilter} />
        <br></br>
        <EmailList emails={emails} />
      </section>
    </section>
  );
}
