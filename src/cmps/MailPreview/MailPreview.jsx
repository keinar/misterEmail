import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import { mailService } from '../../services/mailService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function MailPreview({
  email,
  onRemoveEmail,
  loadEmails,
  currentFolder,
  onUpdateMail,
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [isStarred, setIsStarred] = useState(email.isStarred);
  const [onHover, setOnHover] = useState(false);

  useEffect(() => {
    setIsOpened(email.isRead);
    setIsStarred(email.isStarred);
  }, []);

  const handleMouseEnter = () => {
    setOnHover(true);
  };

  const handleMouseLeave = () => {
    setOnHover(false);
  };

  async function handleOpenState() {
    try {
      const updatedMail = { ...email, isRead: true };
      onUpdateMail(updatedMail);
    } catch (error) {
      console.error('Failed to open email:', error);
    }
  }

  async function onSetIsUnread() {
    try {
      const updatedMail = { ...email, isRead: !email.isRead };
      onUpdateMail(updatedMail);
    } catch (error) {
      console.error('Failed to change read status:', error);
    }
  }

  async function toggleStar() {
    try {
      const prevIsStarred = isStarred;
      setIsStarred(!prevIsStarred); // Optimistically set the state

      if (prevIsStarred) {
        await mailService.removeFromStarred(email.id);
      } else {
        const updatedMail = { ...email, isStarred: true };
        await mailService.saveToStarred(updatedMail);
      }
      loadEmails();
    } catch (error) {
      setIsStarred(isStarred); // Revert the state on error
      console.error('Failed to toggle star:', error);
    }
  }

  const fontWeight = !email.isRead ? 700 : 500;
  const backgroundColor = email.isRead ? '#F2F6FC' : undefined;
  const star = !isStarred ? 'none' : 'yellow';

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
          to={`/${currentFolder}/${email.id}`}
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
      {!onHover && (
        <td>
          <span className="email-sent-time">
            {dayjs(email.sentAt).isBefore(dayjs().subtract(1), 'day')
              ? dayjs(email.sentAt).format('MMM DD')
              : dayjs(email.sentAt).fromNow(true)}
          </span>
        </td>
      )}
      {onHover && (
        <td>
          <Trash2 size={20} onClick={() => onRemoveEmail(email.id)} />

          {!email.isRead ? (
            <Mail size={20} onClick={() => onSetIsUnread()} />
          ) : (
            <MailOpen size={20} onClick={() => onSetIsUnread()} />
          )}
        </td>
      )}
    </tr>
  );
}
