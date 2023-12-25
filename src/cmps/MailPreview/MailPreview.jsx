import { Link } from 'react-router-dom';
import { Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function MailPreview({
  mail,
  onRemoveMail,
  currentFolder,
  handleOpenState,
  onSetIsUnread,
  toggleStar,
  onHover,
  handleMouseEnter,
  handleMouseLeave,
}) {
  const fontWeight = !mail.isRead ? 700 : 500;
  const backgroundColor = mail.isRead ? '#F2F6FC' : undefined;
  const star = !mail.isStarred ? 'none' : 'yellow';

  return (
    <tr
      className="subject"
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td>
        <Star size={20} onClick={() => toggleStar(mail.id)} fill={star} />
      </td>
      <td>
        <Link
          to={`/${currentFolder}/${mail.id}`}
          className={mail.id}
          style={{ fontWeight: fontWeight }}
          onClick={() => handleOpenState(mail.id)}
        >
          {mail.subject}
        </Link>

        <Link
          to={`/inbox/${mail.id}`}
          className={mail.id}
          onClick={() => handleOpenState(mail.id)}
        >
          {mail.body}
        </Link>
      </td>
      {!onHover && (
        <td>
          <span className="email-sent-time">
            {dayjs(mail.sentAt).isBefore(dayjs().subtract(1), 'day')
              ? dayjs(mail.sentAt).format('MMM DD')
              : dayjs(mail.sentAt).fromNow(true)}
          </span>
        </td>
      )}
      {onHover && (
        <td>
          <Trash2 size={20} onClick={() => onRemoveMail(mail.id)} />

          {!mail.isRead ? (
            <Mail size={20} onClick={() => onSetIsUnread(mail.id)} />
          ) : (
            <MailOpen size={20} onClick={() => onSetIsUnread(mail.id)} />
          )}
        </td>
      )}
    </tr>
  );
}
