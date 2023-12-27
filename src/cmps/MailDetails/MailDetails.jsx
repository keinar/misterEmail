import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { mailService } from '../../services/mailService';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

export function MailDetails() {
  const { mails, onRemoveMail, onBack, onNextMail } = useOutletContext();
  const mail = mails.find(mail => mail);

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
