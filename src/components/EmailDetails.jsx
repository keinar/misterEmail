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
    navigate("/email");
  }
  if (!email) return <div>loading...</div>;

  return (
    <section className="email-details">
      {/* full details of a specific email */}
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
    </section>
  );
}
