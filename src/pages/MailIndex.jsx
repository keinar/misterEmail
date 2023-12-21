import { useEffect, useState } from 'react';
import { EmailList } from '../cmps/MailList/MailList.jsx';
import { mailService } from '../services/mailService.js';
import { SideNav } from '../cmps/SideNav/SideNav.jsx';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { EmailComposeModal } from '../cmps/MailCompose/MailCompose.jsx';
import { RightNav } from '../cmps/SideNav/RightNav.jsx';
import { Footer } from '../cmps/Layout/Footer.jsx';
import { Header } from '../cmps/Layout/Header.jsx';

export function MailIndex() {
  const [searchParams] = useSearchParams();

  const [emails, setEmails] = useState(null);
  const [inboxCount, setInboxCount] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const [newMail, setNewMail] = useState(mailService.getDefaultMail());

  const params = useParams();
  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter());
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    loadEmails();
  }, [filterBy, params, isAscending]);

  async function loadEmails() {
    try {
      const emails = await mailService.query(filterBy, params, isAscending);
      setEmails(emails);
      setInboxCount(emails.length);
    } catch (err) {
      console.error('error: ', err);
    }
  }

  async function onRemoveEmail(emailId) {
    try {
      let userConfirmed = '';
      const emailToRemove = await mailService.getById(emailId);

      if (params.folder === 'trash') {
        userConfirmed = confirm('Are you sure to remove this email forever?');
        if (!userConfirmed) return;

        await mailService.remove(emailId);
      } else {
        userConfirmed = confirm('Are you sure to remove this email?');
        if (!userConfirmed) return;

        emailToRemove.removedAt = Date.now();
        await mailService.save(emailToRemove);
      }
      loadEmails();
    } catch (err) {
      console.error('error: ', err);
    }
  }

  async function onUpdateMail(mailToUpdate) {
    try {
      const updatedMail = await mailService.save(mailToUpdate);
      setEmails(prevEmails =>
        prevEmails.map(email => {
          return email.id === updatedMail.id ? updatedMail : email;
        })
      );
    } catch (error) {
      console.error('Failed to change read status:', error);
    }
  }

  const onSetFilter = newFilter => {
    setFilterBy(newFilter);
  };

  function onToggleSortByDate() {
    setIsAscending(!isAscending);
    loadEmails();
  }

  function getEmptyMsg() {
    let emptyMailmessage = '';
    if (!emails || !emails.length) {
      if (params.folder === 'inbox') {
        emptyMailmessage = 'The email inbox is empty :(';
      } else if (params.folder === 'starred') {
        emptyMailmessage = 'You have not starred any message yet :(';
      } else if (params.folder === 'trash') {
        emptyMailmessage = 'The trash is empty';
      } else if (params.folder === 'drafts') {
        emptyMailmessage = 'There are no draft emails here';
      } else if (params.folder === 'sent') {
        emptyMailmessage = 'You did not send any messages yet';
      }
    }
    return emptyMailmessage;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!message) {
        const userConfirmed = confirm(
          'Are you sure that you want to send an empty messsage?'
        );
        if (!userConfirmed) {
          return;
        }
      }
      const emailData = await mailService.createEmail(newMail);
      setEmails(prevEmails => [...prevEmails, emailData]);
      alert('Your message sent successfully');
      navigate('/inbox/');
    } catch (err) {
      console.error('Error', err);
    }
  }

  if (!emails) return <div className="loading">Loading...</div>;

  return (
    <section className="main-app">
      <Header
        filterBy={filterBy}
        onSetFilter={onSetFilter}
        setIsMenuVisible={setIsMenuVisible}
        isMenuVisible={isMenuVisible}
      />
      <main className="container">
        <section className="email-index">
          <SideNav
            currentNav={params.folder}
            emails={emails}
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
            inboxCount={inboxCount}
          />
          <section className="inbox-container">
            {params.emailId ? (
              <Outlet />
            ) : (
              <EmailList
                emails={emails.filter(email =>
                  filterBy.status === 'starred' ? email.isStarred : true
                )}
                loadEmails={loadEmails}
                onToggleSortByDate={onToggleSortByDate}
                isAscending={isAscending}
                params={params}
                onRemoveEmail={onRemoveEmail}
                onUpdateMail={onUpdateMail}
              />
            )}
            {getEmptyMsg()}
          </section>
          <RightNav />

          {searchParams.get('compose') && (
            <EmailComposeModal
              currentNav={params.folder}
              handleSubmit={handleSubmit}
              newMail={newMail}
              setNewMail={setNewMail}
              loadEmails={loadEmails}
            />
          )}
        </section>
      </main>
      <Footer />
    </section>
  );
}
