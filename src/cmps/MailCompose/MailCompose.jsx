import { X } from "lucide-react";
import { emailService } from "../../services/email.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MailComposeForm } from "./MailComposeForm";

export function EmailComposeModal({
  currentNav,
  handleSubmit,
  message,
  subject,
  setSubject,
  setMessage,
  to,
  setTo,
}) {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  function handleOpenCompose() {
    navigate(`/${currentNav}/`);
  }

  useEffect(() => {
    async function fetchUserEmail() {
      const userEmailData = await emailService.getDemoUser();
      setUserEmail(userEmailData[0].email);
    }

    fetchUserEmail();
  }, []);

  return (
    <section className="compose-modal">
      <header>
        <h1>New Message</h1>
        <X size={16} className="close" onClick={handleOpenCompose} />
      </header>
      <MailComposeForm
        setSubject={setSubject}
        setMessage={setMessage}
        userEmail={userEmail}
        handleSubmit={handleSubmit}
        message={message}
        subject={subject}
        to={to}
        setTo={setTo}
      />
    </section>
  );
}
