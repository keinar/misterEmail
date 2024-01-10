import { X } from 'lucide-react';
import { mailService } from '../../services/mailService';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SendHorizonal } from 'lucide-react';
export function MailCompose({ currentNav, onAddMail, onUpdateMail }) {
  const [userMail] = useState(mailService.getLoggedInUser().mail);
  const [mailToEdit, setMailToEdit] = useState(mailService.getDefaultMail());
  const [isFirstChange, setIsFirstChange] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const timeOutRef = useRef();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mailId = searchParams.get('compose');
    if (mailId !== 'new') {
      loadMail(mailId);
    }
  }, [searchParams]);

  async function loadMail(mailId) {
    try {
      const mail = await mailService.getById(mailId);
      setMailToEdit(mail);
    } catch (err) {
      console.log(err);
      navigate('/mail');
    }
  }
  useEffect(() => {
    if (isFirstChange) {
      navigate(`/${currentNav}?compose=${mailToEdit?.id}`);
    }
  }, [isFirstChange, mailToEdit, currentNav]);

  function handleOpenCompose() {
    navigate(`/${currentNav}/`);
  }

  useEffect(() => {
    if (isSending) return;
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
    }
    timeOutRef.current = setTimeout(() => {
      if (!isSending) {
        onSaveDraft(mailToEdit);
      }
    }, 5000);

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, [mailToEdit, isSending]);

  async function onSaveDraft(mail) {
    if (!mail.id) {
      const addedMail = await onAddMail(mail);

      setMailToEdit(addedMail);
      setIsFirstChange(true);
    } else {
      onUpdateMail(mail);
    }
  }
  async function onSendMail(ev) {
    ev.preventDefault();
    setIsSending(true);
    clearTimeout(timeOutRef.current);
    await onSaveDraft({ ...mailToEdit, sentAt: Date.now(), isDraft: false });
    setIsSending(false);
    navigate(`/${currentNav}/`);
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setMailToEdit(prevMail => ({ ...prevMail, [name]: value }));
  }

  return (
    <section className="compose-modal">
      <header>
        <h1>New Message</h1>
        <X size={16} className="close" onClick={handleOpenCompose} />
      </header>
      <form onSubmit={onSendMail}>
        <fieldset className="from">
          <label htmlFor="from">From:</label>
          <input type="email" id="from" name="from" value={userMail} readOnly />
        </fieldset>

        <fieldset className="to">
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            name="to"
            value={mailToEdit.to}
            onChange={handleChange}
            required
          />
        </fieldset>
        <fieldset className="subject">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={mailToEdit.subject}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset className="message">
          <textarea
            id="message"
            name="message"
            value={mailToEdit.message}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset className="submit">
          <button type="submit" name="send" className="send-button">
            <SendHorizonal size={20} />
          </button>
        </fieldset>
      </form>
    </section>
  );
}
