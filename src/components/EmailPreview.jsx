import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailOpen, Star } from "lucide-react";
import { emailService } from "../services/email.service";

export function EmailPreview({ email }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isStarred, setIsStarred] = useState(email.isStarred);

  useEffect(() => {
    setIsOpened(email.isRead);
    setIsStarred(email.isStarred);
  }, [email.isRead, email.isStarred]);

  async function handleOpenState() {
    try {
      setIsOpened(true);
      const updatedEmail = { ...email, isRead: true };
      await emailService.save(updatedEmail);
    } catch (error) {
      console.error("Failed to open email:", error);
    }
  }

  async function toggleStar() {
    try {
      const prevIsStarred = isStarred;
      setIsStarred(!prevIsStarred); // Optimistically set the state

      if (prevIsStarred) {
        await emailService.removeFromStarred(email.id);
      } else {
        const updatedEmail = { ...email, isStarred: true };
        await emailService.saveToStarred(updatedEmail);
      }
    } catch (error) {
      setIsStarred(isStarred); // Revert the state on error
      console.error("Failed to toggle star:", error);
    }
  }

  const fontWeight = !isOpened ? 700 : 500;
  const backgroundColor = !isOpened ? "white" : undefined;
  const star = !isStarred ? "none" : "yellow";
  return (
    <tr className="subject" style={{ backgroundColor: backgroundColor }}>
      <td>
        <Star size={20} onClick={toggleStar} fill={star} />
      </td>
      <td>
        <Link
          to={`/email/${email.id}`}
          className={email.id}
          style={{ fontWeight: fontWeight }}
          onClick={handleOpenState}
        >
          {email.subject}
        </Link>

        <Link
          to={`/email/${email.id}`}
          className={email.id}
          onClick={handleOpenState}
        >
          {email.body}
        </Link>
      </td>
      <td>
        <span className="email-sent-time">{email.sentAt}</span>
      </td>
      <td>{!isOpened ? <Mail size={20} /> : <MailOpen size={20} />}</td>
    </tr>
  );
}
