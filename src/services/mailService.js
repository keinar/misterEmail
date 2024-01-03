import { storageService } from './async-storage.service.js';
import { utilService } from './util.service.js';

export const mailService = {
  query,
  save,
  remove,
  getById,
  createMail,
  getDefaultMail,
  getLoggedInUser,
  getStarredMails,
  getReadMails,
  saveToStarred,
  removeFromStarred,
  getDefaultFilter,
  getFilterFromParams,
};

const EMAIL_KEY = 'mails';
const USER_KEY = 'loggedInUser';

_createMails();
_createDemoUser();

async function getDefaultMail(
  to = '',
  subject = '',
  message = '',
  isRead = false,
  isStarred = false,
  sentAt = null,
  removedAt = null
) {
  const loggedInUser = await getLoggedInUser();
  return {
    to,
    subject,
    message,
    isRead,
    isStarred,
    sentAt,
    removedAt,
    from: loggedInUser.mail,
  };
}

function getDefaultFilter() {
  return { txt: '' };
}

function getFilterFromParams(searchParams) {
  const defaultFilter = getDefaultFilter();
  const filterBy = {};
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || '';
  }
  return filterBy;
}

async function query(filterBy, folder, isAscending) {
  const mails = await storageService.query(EMAIL_KEY);
  const loggedInUser = getLoggedInUser();
  let filteredMails = mails;
  switch (folder) {
    case 'inbox':
      //filter the removed mails and get the others
      filteredMails = mails.filter(
        mail => !mail.removedAt && mail.from !== loggedInUser.mail
      );
      break;
    case 'starred':
      //get only the starred mails
      filteredMails = mails.filter(mail => mail.isStarred && !mail.removedAt);
      break;
    case 'sent':
      //get only the sent mails - with sent time
      filteredMails = mails.filter(mail => mail.sentAt && !mail.removedAt);
      break;
    case 'drafts':
      filteredMails = mails.filter(mail => mail.sentAt === null);
      break;
    case 'trash':
      // get only the mails with removed time
      filteredMails = mails.filter(mail => mail.removedAt);
      break;
    default:
      filteredMails = mails;
  }
  // sort mails by asc / desc
  filteredMails.sort((a, b) =>
    isAscending ? a.sentAt - b.sentAt : b.sentAt - a.sentAt
  );

  if (!filterBy) return filteredMails;

  //search filter by subject and body
  if (filterBy.txt) {
    filteredMails = filteredMails.filter(mail => {
      const subject = mail.subject;
      const message = mail.message;
      const jointString = [subject, message].join(' ');
      return jointString.toLowerCase().includes(filterBy.txt.toLowerCase());
    });
  }
  return filteredMails;
}

function getById(id) {
  return storageService.get(EMAIL_KEY, id);
}

function remove(id) {
  return storageService.remove(EMAIL_KEY, id);
}

function save(mailToSave) {
  if (mailToSave.id) {
    return storageService.put(EMAIL_KEY, mailToSave);
  } else {
    mailToSave.id = utilService.makeId(5);
    return storageService.post(EMAIL_KEY, mailToSave);
  }
}

async function saveToStarred(mailToUpdate) {
  try {
    const mail = await storageService.get(EMAIL_KEY, mailToUpdate.id);
    mail.isStarred = true;
    return await storageService.put(EMAIL_KEY, mail);
  } catch (error) {
    console.error('Failed to save to starred:', error);
    throw error;
  }
}

async function removeFromStarred(mailId) {
  try {
    const mail = await storageService.get(EMAIL_KEY, mailId);
    mail.isStarred = false;
    return await storageService.put(EMAIL_KEY, mail);
  } catch (error) {
    console.error('Failed to remove from starred:', error);
    throw error;
  }
}

async function getStarredMails() {
  const mails = await storageService.query(EMAIL_KEY);
  return mails.filter(mail => mail.isStarred);
}

async function getReadMails() {
  const mails = await storageService.query(EMAIL_KEY);
  return mails.filter(mail => mail.isRead);
}

function createMail(mail) {
  return storageService.post(EMAIL_KEY, mail);
}

function _createDemoUser() {
  let user = utilService.loadFromStorage(USER_KEY);
  if (!user || !user.length) {
    user = {
      mail: 'info@digital-solution.co.il',
      fullname: 'Keinar Elkayam',
    };

    utilService.saveToStorage(USER_KEY, user);
  }
}

function getLoggedInUser() {
  const user = utilService.loadFromStorage(USER_KEY);
  return user;
}

function _createMails(numMails = 50) {
  let mails = utilService.loadFromStorage(EMAIL_KEY);
  if (!mails || !mails.length) {
    mails = [];
    for (let i = 0; i < numMails; i++) {
      const mailData = {
        id: utilService.makeId(5),
        subject: `Subject ${i}`,
        message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book ${i}`,
        isRead: false,
        isStarred: false,
        sentAt: null,
        removedAt: null,
        from: 'example@example.com',
        to: 'user@appsus.com',
      };
      mails.push(mailData);
    }
    utilService.saveToStorage(EMAIL_KEY, mails);
  }
}
