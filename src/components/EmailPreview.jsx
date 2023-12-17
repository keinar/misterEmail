import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailOpen, Star, Trash2 } from "lucide-react";
import { emailService } from "../services/email.service";

export function EmailPreview({ email, onRemoveEmail, loadEmails }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isStarred, setIsStarred] = useState(email.isStarred);
  const [onHover, setOnHover] = useState(false);

  const handleMouseEnter = () => {
    setOnHover(true);
  };

  const handleMouseLeave = () => {
    setOnHover(false);
  };

  useEffect(() => {
    setIsOpened(email.isRead);
    setIsStarred(email.isStarred);
  }, []);

  async function handleOpenState() {
    try {
      setIsOpened(true);
      const updatedEmail = { ...email, isRead: true };
      await emailService.save(updatedEmail);
      loadEmails();
    } catch (error) {
      console.error("Failed to open email:", error);
    }
  }

  async function onSetIsUnread() {
    try {
      setIsOpened((prevIsOpen) => !prevIsOpen);
      const updatedEmail = { ...email, isRead: !isOpened };
      await emailService.save(updatedEmail);
      loadEmails();
    } catch (error) {
      console.error("Failed to change read status:", error);
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
      loadEmails();
    } catch (error) {
      setIsStarred(isStarred); // Revert the state on error
      console.error("Failed to toggle star:", error);
    }
  }

  const fontWeight = !isOpened ? 700 : 500;
  const backgroundColor = isOpened ? "#F2F6FC" : undefined;
  const star = !isStarred ? "none" : "yellow";

  return (
    <tr
      className="subject"
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td>
        <Star size={20} onClick={toggleStar} fill={star} />
      </td>
      <td>
        <Link
          to={`/inbox/${email.id}`}
          className={email.id}
          style={{ fontWeight: fontWeight }}
          onClick={handleOpenState}
        >
          {email.subject}
        </Link>

        <Link
          to={`/inbox/${email.id}`}
          className={email.id}
          onClick={handleOpenState}
        >
          {email.body}
        </Link>
      </td>
      <td>
        <span className="email-sent-time">{email.sentAt}</span>
      </td>
      {onHover && (
        <td>
          <Trash2 size={20} onClick={() => onRemoveEmail(email.id)} />

          {!isOpened ? (
            <Mail size={20} onClick={() => onSetIsUnread()} />
          ) : (
            <MailOpen size={20} onClick={() => onSetIsUnread()} />
          )}
        </td>
      )}
    </tr>
  );
}
