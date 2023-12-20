import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mailService } from '../../services/mailService';
import { Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

export function EmailDetails() {
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

  if (!email) return <div className="loading">loading...</div>;

  return (
    <section className="email-details">
      <h1>{email.subject}</h1>
      <div className="flex space-between">
        <p className="email-from">Author: {email.from}</p>{' '}
        <p>{dayjs(email.sentAt).format('MMMM DD, YYYY [@] H:mm A')}</p>
      </div>
      <p className="email-to">To: {email.to}</p>

      <p className="email-body">{email.body}</p>

      <div className="flex">
        <button className="modern-button" onClick={onBack}>
          Back
        </button>
        <button className="modern-button" onClick={onNextEmail}>
          Next Email
        </button>
        <Trash2 size={20} onClick={onRemoveEmail} />
      </div>
    </section>
  );
}
