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
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js';

export function MailIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const [mails, setMails] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [newMail, setNewMail] = useState(null);

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState(
    mailService.getFilterFromParams(searchParams)
  );
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [onHover, setOnHover] = useState(false);
  useEffect(() => {
    async function initNewMail() {
      const defaultMail = await mailService.getDefaultMail();
      setNewMail(defaultMail);
    }
    initNewMail();
    loadMails();
  }, [filterBy, params, isAscending]);

  async function loadMails() {
    try {
      const mails = await mailService.query(
        filterBy,
        params.folder,
        isAscending
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
        userConfirmed = confirm('Are you sure to remove this mail forever?');
        if (!userConfirmed) return;
        await mailService.remove(mailId);
      } else {
        userConfirmed = confirm('Are you sure to remove this mail?');
        if (!userConfirmed) return;
        mailToRemove.removedAt = Date.now();
        await mailService.save(mailToRemove);
      }
      setMails(prevMails => {
        return prevMails.filter(mail => mail.id !== mailId);
      });
      showSuccessMsg('The mail has been removed successfully');

      if (params.folder + '/' + mailId) {
        onBack();
      }
    } catch (err) {
      console.error("Can't remove mail: ", err);
      showErrorMsg("Error: Can't remove mail");
    }
  }

  // update read / unread
  async function onUpdateMail(mailToUpdate) {
    try {
      const updatedMail = await mailService.save(mailToUpdate);
      setMails(prevMails =>
        prevMails.map(mail => {
          return mail.id === updatedMail.id ? updatedMail : mail;
        })
      );
    } catch (error) {
      console.error('Failed to change read status:', error);
    }
  }

  const onSetFilter = newFilter => {
    setFilterBy(newFilter);
    setSearchParams(newFilter);
  };

  function onToggleSortByDate() {
    setIsAscending(!isAscending);
  }

  function getEmptyMsg() {
    let emptyMailmessage = '';
    if (!mails || !mails.length) {
      if (params.folder === 'inbox') {
        emptyMailmessage = 'The mail inbox is empty :(';
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
      if (!message.value && !subject.value) {
        const userConfirmed = confirm(
          'Send this message without text in the subject or body of the message?'
        );
        if (!userConfirmed) {
          return;
        }
      }
      const mailData = await mailService.createMail(newMail);

      setMails(prevMails => [...prevMails, mailData]);
      // if (!mailData.subject) {
      //   mailData.subject = 'bla';
      // }
      showSuccessMsg('Your message sent successfully');
      navigate('/inbox/');
    } catch (err) {
      console.error('Error', err);
      showErrorMsg("Can't sending mail");
    }
  }

  async function toggleStar(mailId) {
    try {
      const mailToStar = await mailService.getById(mailId);
      const prevIsStarred = mailToStar.isStarred;
      !prevIsStarred;

      if (prevIsStarred) {
        await mailService.removeFromStarred(mailId);
        showSuccessMsg('Mail star has been removed');
      } else {
        const updatedMail = { ...mailToStar, isStarred: true };
        await mailService.saveToStarred(updatedMail);
        showSuccessMsg('Mail starred');
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
      showErrorMsg('Failed to toggle star mail');
    }
  }

  async function handleOpenState(mailId) {
    try {
      const mail = await mailService.getById(mailId);
      const updatedMail = { ...mail, isRead: true };
      onUpdateMail(updatedMail);
      navigate(`/${params.folder}/${mailId}`);
    } catch (error) {
      console.error('Failed to open mail:', error);
    }
  }

  async function onSetIsUnread(mailId) {
    try {
      const mail = await mailService.getById(mailId);
      const updatedMail = { ...mail, isRead: !mail.isRead };
      onUpdateMail(updatedMail);
    } catch (error) {
      console.error('Failed to change read status:', error);
    }
  }

  const handleMouseEnter = mailId => {
    setOnHover(mailId);
  };

  const handleMouseLeave = () => {
    setOnHover(null);
  };

  function onBack() {
    navigate(`/${params.folder}/`);
  }

  async function onNextMail(mailId) {
    const mails = await mailService.query();
    const mailIndex = mails.findIndex(mail => mail.id === mailId);

    let nextMailIndex;

    if (mailIndex >= 0 && mailIndex < mails.length - 1) {
      nextMailIndex = mailIndex + 1;
    } else {
      nextMailIndex = 0;
    }
    const nextMail = mails[nextMailIndex];

    navigate(`/${params.folder}/${nextMail.id}`);
  }

  if (!mails) return <div className="loading">Loading...</div>;
  const mail = mails.find(mail => mail.id === params.mailId);
  return (
    <section className="main-app">
      <Header
        filterBy={filterBy}
        onSetFilter={onSetFilter}
        setIsMenuVisible={setIsMenuVisible}
        isMenuVisible={isMenuVisible}
      />
      <main className="container">
        <section className="mail-index">
          <SideNav
            currentNav={params.folder}
            mails={mails}
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
            inboxCount={mails.length}
          />
          <section className="inbox-container">
            {params.mailId ? (
              <Outlet
                context={{
                  onRemoveMail,
                  loadMails,
                  onBack,
                  onNextMail,
                  toggleStar,
                  onSetIsUnread,
                  mail,
                }}
              />
            ) : (
              <MailList
                mails={mails.filter(mail =>
                  filterBy.status === 'starred' ? mail.isStarred : true
                )}
                onToggleSortByDate={onToggleSortByDate}
                isAscending={isAscending}
                params={params}
                onRemoveMail={onRemoveMail}
                handleOpenState={handleOpenState}
                onSetIsUnread={onSetIsUnread}
                toggleStar={toggleStar}
                onHover={onHover}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
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
            />
          )}
        </section>
      </main>
      <Footer />
    </section>
  );
}
