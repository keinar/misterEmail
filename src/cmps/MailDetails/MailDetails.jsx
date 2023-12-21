import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mailService } from '../../services/mailService';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

export function MailDetails() {
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmail();
  }, [params.emailId]);

  async function onRemoveEmail() {
    try {
      let userConfirmed = '';
      if (params.folder === 'trash') {
        userConfirmed = confirm('Are you sure to remove this email forever?');
        if (!userConfirmed) {
          return;
        }
        await mailService.remove(email.id);
      } else {
        userConfirmed = confirm('Are you sure to remove this email?');
        if (!userConfirmed) {
          return;
        }
        const emailToRemove = await mailService.getById(email.id);
        emailToRemove.removedAt = Date.now();
        await mailService.save(emailToRemove);
      }
      navigate(`/${params.folder}/`, { state: { refresh: true } });
    } catch (err) {
      console.error("Can't navigate back: ", err);
    }
  }

  async function loadEmail() {
    try {
      const email = await mailService.getById(params.emailId);
      setEmail(email);
    } catch (err) {
      console.error('Error on load emails: ', err);
    }
  }

  function onBack() {
    navigate(`/${params.folder}/`);
  }

  async function onNextEmail() {
    const emails = await mailService.query();
    const emailIdToFind = email.id;
    const emailIndex = emails.findIndex(email => email.id === emailIdToFind);

    let nextEmailIndex;

    if (emailIndex >= 0 && emailIndex < emails.length - 1) {
      nextEmailIndex = emailIndex + 1;
    } else {
      nextEmailIndex = 0;
    }
    const nextEmail = emails[nextEmailIndex];
    navigate(`/${params.folder}/${nextEmail.id}`);
  }

  // async function loadNextEmailId() {
  //   try {
  //     const email = await mailService.getById(params.emailId);
  //     setEmail(email);
  //   } catch (err) {
  //     console.error('Error on load emails: ', err);
  //   }
  // }

  if (!email) return <div className="loading">loading...</div>;

  return (
    <section className="mail-details">
      <h1>{email.subject}</h1>
      <div className="flex space-between">
        <p className="mail-from">Author: {email.from}</p>{' '}
        <p className="mail-details-sent-at">
          {dayjs(email.sentAt).format('MMMM DD, YYYY [@] H:mm A')}
        </p>
      </div>
      <p className="mail-to">To: {email.to}</p>

      <p className="mail-body">{email.body}</p>

      <div className="flex align-center">
        <button className="simple-button left" onClick={onBack}>
          <ChevronLeft size={18} /> Back
        </button>
        <button className="simple-button right" onClick={onNextEmail}>
          Next Email <ChevronRight size={18} />
        </button>
        <Trash2 size={20} onClick={onRemoveEmail} />
      </div>
    </section>
  );
}
