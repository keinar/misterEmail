import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mailService } from '../../services/mailService';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

export function MailDetails() {
  const [mail, setMail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadMail();
  }, []);
  async function onRemoveMail() {
    try {
      let userConfirmed = '';
      if (params.folder === 'trash') {
        userConfirmed = confirm('Are you sure to remove this mail forever?');
        if (!userConfirmed) {
          return;
        }
        await mailService.remove(mail.id);
      } else {
        userConfirmed = confirm('Are you sure to remove this mail?');
        if (!userConfirmed) {
          return;
        }
        const mailToRemove = await mailService.getById(mail.id);
        mailToRemove.removedAt = Date.now();
        await mailService.save(mailToRemove);
      }
      navigate(`/${params.folder}/`, { state: { refresh: true } });
    } catch (err) {
      console.error("Can't navigate back: ", err);
    }
  }

  async function loadMail() {
    try {
      const mail = await mailService.getById(params.mailId);
      setMail(mail);
    } catch (err) {
      console.error('Error on load mails: ', err);
    }
  }

  function onBack() {
    navigate(`/${params.folder}/`);
  }

  async function onNextMail() {
    const mails = await mailService.query();
    const mailIdToFind = mail.id;
    const mailIndex = mails.findIndex(mail => mail.id === mailIdToFind);

    let nextMailIndex;

    if (mailIndex >= 0 && mailIndex < mails.length - 1) {
      nextMailIndex = mailIndex + 1;
    } else {
      nextMailIndex = 0;
    }
    const nextMail = mails[nextMailIndex];
    navigate(`/${params.folder}/${nextMail.id}`);
  }

  if (!mail) return <div className="loading">loading...</div>;

  return (
    <section className="mail-details">
      <h1>{mail.subject}</h1>
      <div className="flex space-between">
        <p className="mail-from">Author: {mail.from}</p>{' '}
        <p className="mail-details-sent-at">
          {dayjs(mail.sentAt).format('MMMM DD, YYYY [@] H:mm A')}
        </p>
      </div>
      <p className="mail-to">To: {mail.to}</p>

      <p className="mail-body">{mail.body}</p>

      <div className="flex align-center">
        <button className="simple-button left" onClick={onBack}>
          <ChevronLeft size={18} /> Back
        </button>
        <button className="simple-button right" onClick={onNextMail}>
          Next Mail <ChevronRight size={18} />
        </button>
        <Trash2 size={20} onClick={onRemoveMail} />
      </div>
    </section>
  );
}
