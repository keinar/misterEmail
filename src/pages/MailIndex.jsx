import { useEffect, useState } from 'react';
import { EmailList } from '../cmps/MailList/MailList.jsx';
import { mailService } from '../services/mailService.js';
import { SideNav } from '../cmps/SideNav/SideNav.jsx';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { EmailComposeModal } from '../cmps/MailCompose/MailCompose.jsx';
import { RightNav } from '../cmps/SideNav/RightNav.jsx';

export function MailIndex({ filterBy, isMenuVisible, setIsMenuVisible }) {
  const [emails, setEmails] = useState(null);
  const [searchParams] = useSearchParams();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [inboxCount, setInboxCount] = useState(0);
  const [to, setTo] = useState('');
  const params = useParams();
  const location = useLocation();
  let emptyMailmessage = '';
  const [isAscending, setIsAscending] = useState(true);

  function onToggleSortByDate() {
    setIsAscending(!isAscending);
    loadEmails();
  }

  if (!emails || !emails.length) {
    if (params.folder === 'inbox') {
      emptyMailmessage = 'The email inbox is empty :(';
    } else if (params.folder === 'starred') {
      emptyMailmessage = 'You have not starred any message yet :(';
    } else if (params.folder === 'bin') {
      emptyMailmessage = 'The bin is empty';
    } else if (params.folder === 'drafts') {
      emptyMailmessage = 'There are no draft emails here';
    } else if (params.folder === 'sent') {
      emptyMailmessage = 'You did not send any messages yet';
    }
  }

  async function handleSubmit(e, subject, message, to, userEmail) {
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
      const emailData = await mailService.createEmail(
        subject,
        message,
        false, // isRead
        false, // isStarred
        userEmail,
        to
      );
      // Clear the form fields after submission
      alert('Your message sent successfully');
      setSubject('');
      setMessage('');
      loadEmails();
    } catch (err) {
      console.error('Error', err);
    }
  }

  useEffect(() => {
    loadEmails();
  }, [filterBy, location, isAscending]);

  async function loadEmails() {
    try {
      const loadedEmails = await mailService.query(filterBy);
      let filteredEmails = [...loadedEmails];

      if (params.folder === 'starred') {
        filteredEmails = loadedEmails.filter(email => email.isStarred);
      } else if (params.folder === 'inbox') {
        filteredEmails = loadedEmails;
      } else {
        filteredEmails = loadedEmails;
      }

      filteredEmails.sort((a, b) =>
        isAscending ? a.sentAt - b.sentAt : b.sentAt - a.sentAt
      );

      setEmails(filteredEmails);
      setInboxCount(loadedEmails.length);
    } catch (err) {
      console.error('error: ', err);
    }
  }
  if (!emails) return <div className="loading">Loading...</div>;

  return (
    <section className="email-index">
      <SideNav
        currentNav={params.folder}
        emails={emails}
        isMenuVisible={isMenuVisible}
        setIsMenuVisible={setIsMenuVisible}
        inboxCount={inboxCount}
      />
      <section className="inbox-container">
        {/* render here pages - email list / starred / drafts / sent etc.  */}
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
          />
        )}{' '}
        {emptyMailmessage}
      </section>
      <RightNav />

      {searchParams.get('compose') && (
        <EmailComposeModal
          currentNav={params.folder}
          handleSubmit={handleSubmit}
          subject={subject}
          message={message}
          setMessage={setMessage}
          setSubject={setSubject}
          to={to}
          setTo={setTo}
          loadEmails={loadEmails}
        />
      )}
    </section>
  );
}
