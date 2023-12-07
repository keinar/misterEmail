import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { emailService } from "../services/email.service";

export function EmailDetails() {
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmail();
  }, [params.emailId]);

  async function loadEmail() {
    try {
      const email = await emailService.getById(params.emailId);
      setEmail(email);
    } catch (err) {
      console.error("error: ", err);
    }
  }

  // function getEmailById(email){
  //   return emailService.getById(email)
  // }

  function onBack() {
    navigate("/email-inbox");
  }
  if (!email) return <div>loading...</div>;

  console.log(email);
  return (
    <section className="email-details">
      {/* full details of a specific email */}
      <h1>Subject: {email.subject}</h1>
      <p>from: {email.from}</p>
      <p>to: {email.to}</p>
      <p>Body: {email.body}</p>

      <p>sent at: {email.sentAt}</p>
      <Link to={`/email-inbox/:e103`}>Next Email</Link>
      <button onClick={onBack}>Back</button>
    </section>
  );
}
