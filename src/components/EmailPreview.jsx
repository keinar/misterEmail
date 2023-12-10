import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailOpen, Star } from "lucide-react";
import { emailService } from "../services/email.service";

export function EmailPreview({ email }) {
  const [isOpened, setIsOpened] = useState(
    () => localStorage.getItem(`${email.id}`) === "true"
  );
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    localStorage.setItem(`${email.id}`, JSON.stringify(isOpened));
  }, [isOpened, isStarred]);

  function handleOpenState() {
    setIsOpened(true);
    localStorage.setItem(`${email.id}`, "true");
  }

  function fillStar() {
    setIsStarred((prevIsStarred) => {
      if (prevIsStarred) {
        emailService.removeFromStarred(email.id);
      } else {
        emailService.saveToStarred(email);
      }
      return !prevIsStarred;
    });
  }

  const fontWeight = !isOpened ? 700 : 500;
  const backgroundColor = !isOpened && "white";
  const star = !isStarred ? "white" : "yellow";
  return (
    <>
      <td
        className="subject"
        onClick={handleOpenState}
        style={{ backgroundColor: backgroundColor }}
      >
        <Star size={20} onClick={fillStar} fill={star} />

        <Link
          to={`/email/${email.id}`}
          className={email.id}
          style={{ fontWeight: fontWeight }}
        >
          {email.subject}
        </Link>
        <span className="email-sent-time">{email.sentAt}</span>
        {!isOpened ? <Mail size={20} /> : <MailOpen size={20} />}
      </td>
    </>
  );
}
