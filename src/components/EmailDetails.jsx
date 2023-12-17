import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { emailService } from "../services/email.service";
import { Trash2 } from "lucide-react";

export function EmailDetails() {
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmail();
  }, [params.emailId]);

  async function onRemoveEmail() {
    try {
      const userConfirmed = confirm("Are you sure to remove this email?");
      if (!userConfirmed) {
        return;
      }
      await emailService.remove(params.emailId);
      navigate(`/${params.folder}/`, { state: { refresh: true } });
    } catch (err) {
      console.error("Can't navigate back: ", err);
    }
  }

  async function loadEmail() {
    try {
      const email = await emailService.getById(params.emailId);
      setEmail(email);
    } catch (err) {
      console.error("Error on load emails: ", err);
    }
  }

  function onBack() {
    navigate(`/${params.folder}/`);
  }

  async function onNextEmail() {
    const emails = await emailService.query();
    const emailIdToFind = email.id;
    const emailIndex = emails.findIndex((email) => email.id === emailIdToFind);

    let nextEmailIndex;

    if (emailIndex >= 0 && emailIndex < emails.length - 1) {
      nextEmailIndex = emailIndex + 1;
    } else {
      nextEmailIndex = 0;
    }
    const nextEmail = emails[nextEmailIndex];
    navigate(`/${params.folder}/${nextEmail.id}`);
  }

  if (!email) return <div className="loading">loading...</div>;

  return (
    <section className="email-details">
      <h1>{email.subject}</h1>
      <p className="email-from">from: {email.from}</p>
      <p className="email-to">to: {email.to}</p>
      <p className="email-sent-at">sent at: {email.sentAt}</p>
      <br></br>
      <p className="email-body">{email.body}</p>
      <br></br>
      <hr></hr>
      <button onClick={onBack}>Back</button>{" "}
      <button onClick={onNextEmail}>Next Email</button>
      <Trash2 size={20} onClick={onRemoveEmail} />
    </section>
  );
}
