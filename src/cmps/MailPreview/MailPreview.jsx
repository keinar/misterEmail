import { Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { mailService } from '../../services/mailService';
import { MailSentTime } from '../Common/MailSentTime.jsx';
import { useNavigate, useParams } from 'react-router-dom';

export function MailPreview({ mail, onRemoveMail, onUpdateMail }) {
  const [onHover, setOnHover] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  function MailExtracts(message, length) {
    let mailMessage = message;
    let firstNCharacters = mailMessage.substring(0, length);
    return firstNCharacters + '...';
  }

  function onToggleStar() {
    const newMail = { ...mail, isStarred: !mail.isStarred };
    onUpdateMail(newMail);
  }

  function onSetRead(isRead) {
    const newMail = { ...mail, isRead };
    onUpdateMail(newMail);
  }

  function onOpenMail() {
    onSetRead(true);
    params.folder === 'drafts'
      ? navigate(`/drafts?compose=${mail.id}`)
      : navigate(`/${params.folder}/${mail.id}`);
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

  return (
    <tr
      className="subject"
      style={{ backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenMail()}
    >
      {!mail.removedAt && (
        <td>
          <span className="hover-wrapper">
            <Star
              size={20}
              onClick={e => {
                e.stopPropagation();
                onToggleStar();
              }}
              fill={star}
            />
          </span>
        </td>
      )}
      {mail.sentAt && !mail.isDrafts && (
        <td className="mail-send-label"> Sent</td>
      )}

      {!mail.sentAt && !mail.isDraft && (
        <td className="mail-send-label"> Incoming</td>
      )}
      {mail.isDraft && <td className="mail-send-label"> Drafts</td>}
      <td>
        <span style={{ fontWeight }}>{MailExtracts(mail.subject, 10)}</span>
        <span className="body">{MailExtracts(mail.message, 80)}</span>
      </td>

      {!onHover && (
        <td>
          {params.folder === 'drafts' ? (
            ''
          ) : (
            <MailSentTime mailSentAt={mail.sentAt} />
          )}
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
                    onSetRead(true);
                  }}
                />
              ) : (
                <MailOpen
                  size={20}
                  onClick={e => {
                    e.stopPropagation();
                    onSetRead(false);
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
