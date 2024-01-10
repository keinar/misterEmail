import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ChevronLeft, Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { mailService } from '../../services/mailService';
import { useEffect, useState } from 'react';

export function MailDetails() {
  const { onRemoveMail, onBack, onNextMail, toggleStar, onSetIsUnread } =
    useOutletContext();
  const [mail, setMail] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadMail();
  }, [params.mailId]);

  async function loadMail() {
    try {
      const mail = await mailService.getById(params.mailId);
      setMail(mail);
    } catch (err) {
      console.log(err);
      navigate('/mail');
    }
  }

  if (!mail) return <div className="loading">loading...</div>;
  const star = !mail.isStarred ? 'none' : 'yellow';
  return (
    <section className="mail-details">
      <div className="mail-details-toolbar">
        <div className="hover-wrapper">
          <ChevronLeft size={15} onClick={onBack} />
        </div>
        <div className="hover-wrapper">
          <Trash2 size={15} onClick={() => onRemoveMail(mail.id)} />
        </div>
        <div className="hover-wrapper">
          <Star
            size={15}
            onClick={() => {
              toggleStar(mail.id);
            }}
            fill={star}
          />
        </div>

        <div className="hover-wrapper">
          {mail.isRead ? (
            <MailOpen
              size={15}
              onClick={() => {
                onSetIsUnread(mail.id);
                onBack();
              }}
            />
          ) : (
            <Mail
              size={15}
              onClick={() => {
                onSetIsUnread(mail.id);
              }}
            />
          )}
        </div>
        <p onClick={() => onNextMail(mail.id)}>Next Mail</p>
      </div>

      <h1>{mail.subject}</h1>
      <div className="flex space-between">
        <p className="mail-from">Author: {mail.from}</p>{' '}
        <p className="mail-details-sent-at">
          {params.folder === 'drafts'
            ? ''
            : dayjs(mail.sentAt).format('MMMM DD, YYYY [@] H:mm A')}
        </p>
      </div>
      <p className="mail-to">To: {mail.to}</p>
      <p className="mail-body">{mail.message}</p>
      <div className="flex align-center"></div>
    </section>
  );
}
