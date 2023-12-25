import { useEffect, useState } from 'react';
import { MailList } from '../cmps/MailList/MailList.jsx';
import { mailService } from '../services/mailService.js';
import { SideNav } from '../cmps/SideNav/SideNav.jsx';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { MailCompose } from '../cmps/MailCompose/MailCompose.jsx';
import { RightNav } from '../cmps/SideNav/RightNav.jsx';
import { Footer } from '../cmps/Layout/Footer.jsx';
import { Header } from '../cmps/Layout/Header.jsx';

export function MailIndex() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const [mails, setMails] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [inboxCount, setInboxCount] = useState(0);

  const [newMail, setNewMail] = useState(mailService.getDefaultMail());

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState({ txt: '' });
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    loadMails();
  }, [filterBy, params, isAscending]);

  async function loadMails() {
    try {
      const mails = await mailService.query(
        filterBy,
        params.folder,
        isAscending,
        setInboxCount
      );
      setMails(mails);
    } catch (err) {
      console.error('error: ', err);
    }
  }

  async function onRemoveMail(mailId) {
    try {
      let userConfirmed = '';
      const mailToRemove = await mailService.getById(mailId);

      if (params.folder === 'trash') {
        userConfirmed = confirm('Are you sure to remove this email forever?');
        if (!userConfirmed) return;
        await mailService.remove(mailId);
      } else {
        userConfirmed = confirm('Are you sure to remove this email?');
        if (!userConfirmed) return;
        mailToRemove.removedAt = Date.now();
        await mailService.save(mailToRemove);
      }
      setMails(prevMails => {
        return prevMails.filter(mail => mail.id !== mailId);
      });
    } catch (err) {
      console.error('error: ', err);
    }
  }

  // update read / unread
  async function onUpdateMail(mailToUpdate) {
    try {
      const updatedMail = await mailService.save(mailToUpdate);
      setMails(prevMails =>
        prevMails.map(email => {
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
    loadMails();
  }

  function getEmptyMsg() {
    let emptyMailmessage = '';
    if (!mails || !mails.length) {
      if (params.folder === 'inbox') {
        emptyMailmessage = 'The email inbox is empty :(';
      } else if (params.folder === 'starred') {
        emptyMailmessage = 'You have not starred any message yet :(';
      } else if (params.folder === 'trash') {
        emptyMailmessage = 'The trash is empty';
      } else if (params.folder === 'drafts') {
        emptyMailmessage = 'There are no draft mails here';
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
      const emailData = await mailService.createMail(newMail);
      setMails(prevMails => [...prevMails, emailData]);
      alert('Your message sent successfully');
      navigate('/inbox/');
    } catch (err) {
      console.error('Error', err);
    }
  }

  async function toggleStar(mailId) {
    try {
      const mailToStar = await mailService.getById(mailId);
      const prevIsStarred = mailToStar.isStarred;
      !prevIsStarred;

      if (prevIsStarred) {
        await mailService.removeFromStarred(mailId);
      } else {
        const updatedMail = { ...mailToStar, isStarred: true };
        await mailService.saveToStarred(updatedMail);
      }
      setMails(prevMails =>
        prevMails.map(mail =>
          mail.id === mailToStar.id
            ? { ...mail, isStarred: !mail.isStarred }
            : mail
        )
      );
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  }

  if (!mails) return <div className="loading">Loading...</div>;

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
            mails={mails}
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
            inboxCount={mails.length}
          />
          <section className="inbox-container">
            {params.emailId ? (
              <Outlet />
            ) : (
              <MailList
                mails={mails.filter(email =>
                  filterBy.status === 'starred' ? email.isStarred : true
                )}
                loadMails={loadMails}
                onToggleSortByDate={onToggleSortByDate}
                isAscending={isAscending}
                params={params}
                onRemoveMail={onRemoveMail}
                onUpdateMail={onUpdateMail}
                toggleStar={toggleStar}
              />
            )}
            {getEmptyMsg()}
          </section>
          <RightNav />

          {searchParams.get('compose') && (
            <MailCompose
              currentNav={params.folder}
              handleSubmit={handleSubmit}
              newMail={newMail}
              setNewMail={setNewMail}
              loadMails={loadMails}
            />
          )}
        </section>
      </main>
      <Footer />
    </section>
  );
}
