import { X } from 'lucide-react';
import { mailService } from '../../services/mailService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailComposeForm } from './MailComposeForm';

export function MailCompose({ currentNav, handleSubmit, newMail, setNewMail }) {
  const [userMail] = useState(mailService.getLoggedInUser().mail);
  const navigate = useNavigate();

  function handleOpenCompose() {
    navigate(`/${currentNav}/`);
  }

  return (
    <section className="compose-modal">
      <header>
        <h1>New Message</h1>
        <X size={16} className="close" onClick={handleOpenCompose} />
      </header>
      <MailComposeForm
        newMail={newMail}
        setNewMail={setNewMail}
        handleSubmit={handleSubmit}
        userMail={userMail}
      />
    </section>
  );
}
