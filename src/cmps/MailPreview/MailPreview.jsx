import { Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { mailService } from '../../services/mailService';
dayjs.extend(relativeTime);

export function MailPreview({
  mail,
  onRemoveMail,
  handleOpenState,
  onSetIsUnread,
  toggleStar,
}) {
  const [onHover, setOnHover] = useState(false);

  function MailMessageDisplay(message, length) {
    let mailMessage = message;
    let firstNCharacters = mailMessage.substring(0, length);
    return firstNCharacters + '...';
  }

  const handleMouseEnter = mailId => {
    setOnHover(mailId);
  };

  const handleMouseLeave = () => {
    setOnHover(null);
  };

  const fontWeight = !mail.isRead ? 700 : 500;
  const backgroundColor = mail.isRead ? '#F2F6FC' : undefined;
  const star = !mail.isStarred ? 'none' : 'yellow';
  // const isRemovedMail = !mail.removedAt
  //   ? 'auto 1fr auto'
  //   : 'auto auto 1fr auto';
  return (
    <tr
      className="subject"
      style={{ backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleOpenState(mail.id)}
    >
      {!mail.removedAt && (
        <td>
          <span className="hover-wrapper">
            <Star
              size={20}
              onClick={e => {
                e.stopPropagation();
                toggleStar(mail.id);
              }}
              fill={star}
            />
          </span>
        </td>
      )}
      {mail.sentAt && <td className="mail-send-label"> Sent</td>}
      {mail.from !== mailService.getLoggedInUser().mail && (
        <td className="mail-send-label"> Incoming</td>
      )}
      <td>
        <span style={{ fontWeight }}>
          {MailMessageDisplay(mail.subject, 10)}
        </span>
        <span className="body">{MailMessageDisplay(mail.message, 80)}</span>
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
        <td className="flex">
          <span className="hover-wrapper">
            <Trash2
              size={20}
              onClick={e => {
                e.stopPropagation();
                onRemoveMail(mail.id);
              }}
            />
          </span>
          {!mail.removedAt && (
            <span className="hover-wrapper">
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
            </span>
          )}
        </td>
      )}
    </tr>
  );
}
