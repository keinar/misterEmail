import { Link } from 'react-router-dom';
import { Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function MailPreview({
  mail,
  onRemoveMail,
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
      onClick={() => handleOpenState(mail.id)}
    >
      <td>
        <Star
          size={20}
          onClick={e => {
            e.stopPropagation();
            toggleStar(mail.id);
          }}
          fill={star}
        />
      </td>
      <td>
        <span style={{ fontWeight: fontWeight }}>{mail.subject}</span>
        <span className="body">{mail.message}</span>
      </td>

      {!onHover && (
        <td>
          <span className="mail-sent-time">
            {dayjs(mail.sentAt).isBefore(dayjs().subtract(1), 'day')
              ? dayjs(mail.sentAt).format('MMM DD')
              : dayjs(mail.sentAt).fromNow(true)}
          </span>
        </td>
      )}
      {onHover && (
        <td>
          <Trash2
            size={20}
            onClick={e => {
              e.stopPropagation();
              onRemoveMail(mail.id);
            }}
          />

          {!mail.isRead ? (
            <Mail
              size={20}
              onClick={e => {
                e.stopPropagation();
                onSetIsUnread(mail.id);
              }}
            />
          ) : (
            <MailOpen
              size={20}
              onClick={e => {
                e.stopPropagation();
                onSetIsUnread(mail.id);
              }}
            />
          )}
        </td>
      )}
    </tr>
  );
}
