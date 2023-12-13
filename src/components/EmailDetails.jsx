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
      await emailService.remove(params.emailId);
      navigate("/");
    } catch (err) {
      console.error("error: ", err);
    }
  }

  async function loadEmail() {
    try {
      const email = await emailService.getById(params.emailId);
      setEmail(email);
    } catch (err) {
      console.error("error: ", err);
    }
  }

  function onBack() {
    navigate("/");
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
      <Link to={`/email/:e103`}>Next Email</Link>
      <Trash2 size={20} onClick={onRemoveEmail} />
    </section>
  );
}
