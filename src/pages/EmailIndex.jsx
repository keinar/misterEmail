import { useEffect, useState } from "react";
import { EmailList } from "../components/EmailList";
import { emailService } from "../services/email.service";
import { SideNav } from "../components/SideNav";
import { Link, Outlet, useParams, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { EmailComposeModal } from "../components/EmailComposeModal.jsx";
import { RightNav } from "../components/RightNav.jsx";

export function EmailIndex({ filterBy, isMenuVisible, toggleMenu }) {
  const location = useLocation();
  const [emails, setEmails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

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

  if (!emails) return <div>Loading...</div>;

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
        <EmailComposeModal currentNav={params.folder} />
      )}
    </section>
  );
}
