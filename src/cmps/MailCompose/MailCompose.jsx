import { X } from 'lucide-react';
import { mailService } from '../../services/mailService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailComposeForm } from './MailComposeForm';

export function EmailComposeModal({
  currentNav,
  handleSubmit,
  newMail,
  setNewMail,
}) {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  function handleOpenCompose() {
    navigate(`/${currentNav}/`);
  }

  useEffect(() => {
    async function fetchUserEmail() {
      const userEmailData = await mailService.getDemoUser();
      setUserEmail(userEmailData[0].email);
    }

    fetchUserEmail();
  }, []);

  return (
    <section className="compose-modal">
      <header>
        <h1>New Message</h1>
        <X size={16} className="close" onClick={handleOpenCompose} />
      </header>
      <MailComposeForm
        newMail={newMail}
        setNewMail={setNewMail}
        userEmail={userEmail}
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
