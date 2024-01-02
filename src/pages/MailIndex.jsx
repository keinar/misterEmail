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
import { MailToolBar } from '../cmps/MailFilter/MailToolBar.jsx';

export function MailIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  // Used for getting a filtered mails list
  const [mails, setMails] = useState(null);
  // Used for creating a new mail
  const [newMail, setNewMail] = useState(null);
  // Used for sorting asc & desc
  const [isAscending, setIsAscending] = useState(true);

  const [filterBy, setFilterBy] = useState(
    mailService.getFilterFromParams(searchParams)
  );
  // Used for mobile  visability
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const mailsPerPage = 20;

  // Used for rendering mails
  useEffect(() => {
    loadMails();
    setCurrentPage(1);
  }, [filterBy, params.folder, isAscending]);

  // Used for initialization of mail fields
  useEffect(() => {
    async function initNewMail() {
      const defaultMail = await mailService.getDefaultMail();
      setNewMail(defaultMail);
    }
    initNewMail();
  }, []);

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

  function getMailsForDisplay() {
    const startIndex = (currentPage - 1) * mailsPerPage;
    const endIndex = startIndex + mailsPerPage;
    let mailsForDisplay = mails;
    const loggedInUser = mailService.getLoggedInUser();
    const { folder } = params;

    if (folder === 'starred') {
      mailsForDisplay = mailsForDisplay.filter(mail => {
        return mail.isStarred;
      });
    }

    if (folder === 'inbox') {
      mailsForDisplay = mailsForDisplay.filter(mail => {
        return !mail.removedAt && mail.from !== loggedInUser.mail;
      });
    }
    return mailsForDisplay.slice(startIndex, endIndex);
  }

  function onSetFilter(newFilter) {
    setFilterBy(newFilter);
    setSearchParams(newFilter);
  }

  function onToggleSortByDate() {
    setIsAscending(prevSort => !prevSort);
  }

  function getEmptyMsg() {
    let emptyMailmessage = '';

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

    return emptyMailmessage;
  }

  // This function handle the mail compose submit form
  async function handleSubmit(e) {
    e.preventDefault();
    let subjectValue = subject.value;
    const messageValue = message.value;

    if (!subjectValue) {
      subjectValue = '(No Subject)';
    }

    if (!messageValue && subjectValue === '(No Subject)') {
      const userConfirmed = confirm(
        'Send this mail without subject or body message?'
      );
      if (!userConfirmed) {
        return;
      } else {
        subjectValue = '(No Subject)';
      }
    }

    const mailToCreate = {
      ...newMail,
      subject: subjectValue,
      message: messageValue,
      sentAt: Date.now(),
    };
    try {
      const mailData = await mailService.createMail(mailToCreate);

      setMails(prevMails => [...prevMails, mailData]);
      showSuccessMsg('Your message sent successfully');
      navigate(`/${params.folder}/`);
    } catch (err) {
      console.error('Error', err);
      showErrorMsg("Can't sending mail");
    }
  }

  async function toggleStar(mailId) {
    try {
      const mailToStar = mails.find(mail => mail.id === mailId);
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
      const mail = mails.find(mail => mail.id === mailId);
      const updatedMail = { ...mail, isRead: !mail.isRead };
      onUpdateMail(updatedMail);
      if (mail.isRead) {
        showSuccessMsg('Marked as an unread mail');
      } else {
        showSuccessMsg('Marked as read mail');
      }
    } catch (error) {
      console.error('Failed to change read status:', error);
      showErrorMsg('Error: Failed to change read status');
    }
  }

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

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  if (!mails) return <div className="loading">Loading...</div>;

  // Used for the outlet (mail details)
  const mail = mails.find(mail => mail.id === params.mailId);
  return (
    <section className="main-app">
      <Header
        filterBy={filterBy}
        onSetFilter={onSetFilter}
        toggleMenu={toggleMenu}
      />
      <main className="container">
        <section className="mail-index">
          <SideNav
            currentNav={params.folder}
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
            inboxCount={getMailsForDisplay().length}
          />
          <section className="inbox-container">
            <MailToolBar
              onToggleSortByDate={onToggleSortByDate}
              isAscending={isAscending}
              mails={mails}
              setMails={setMails}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              mailsPerPage={mailsPerPage}
            />
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
                mails={getMailsForDisplay()}
                onToggleSortByDate={onToggleSortByDate}
                isAscending={isAscending}
                params={params}
                onRemoveMail={onRemoveMail}
                handleOpenState={handleOpenState}
                onSetIsUnread={onSetIsUnread}
                toggleStar={toggleStar}
              />
            )}
            {!getMailsForDisplay().length && getEmptyMsg()}
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
