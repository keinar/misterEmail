import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailOpen, Star } from "lucide-react";
import { emailService } from "../services/email.service";

export function EmailPreview({ email }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isStarred, setIsStarred] = useState(email.isStarred);
  const [isRead, setIsRead] = useState(email.isRead);

  useEffect(() => {
    setIsOpened(email.isRead);
  }, [email.isRead]);

  async function handleOpenState() {
    setIsOpened(true);
    const updatedEmail = { ...email, isRead: true };
    await emailService.save(updatedEmail);
  }

  function fillStar() {
    setIsStarred((prevIsStarred) => {
      if (prevIsStarred) {
        emailService.removeFromStarred(email.id);
      } else {
        const updatedEmail = { ...email, isStarred: true };
        emailService.saveToStarred(updatedEmail);
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
