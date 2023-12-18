import { storageService } from './async-storage.service.js';
import { utilService } from './util.service.js';

export const mailService = {
  query,
  save,
  remove,
  getById,
  createEmail,
  getDefaultFilter,
  getDemoUser,
  getStarredEmails,
  saveToStarred,
  removeFromStarred,
};

const EMAIL_KEY = 'emails';
const USER_KEY = 'loggedInUser';

_createEmails();
_createDemoUser();

function getDefaultFilter() {
  return {
    status: '',
    txt: '',
    isRead: null,
  };
}

async function query(filterBy) {
  const emails = await storageService.query(EMAIL_KEY);
  if (filterBy) {
    let filteredEmails = emails;

    if (filterBy.txt) {
      console.log(filterBy);
      filteredEmails = filteredEmails.filter(email => {
        const subject = email.subject;
        const body = email.body;
        const jointString = [subject, body].join(' ');
        return jointString.toLowerCase().includes(filterBy.txt.toLowerCase());
      });
    }

    if (filterBy.isRead === true) {
      filteredEmails = filteredEmails.filter(
        email => email.isRead === filterBy.isRead
      );
    }

    if (filterBy.status === 'starred') {
      filteredEmails = filteredEmails.filter(email => email.isStarred);
    }

    return filteredEmails;
  }

  return emails;
}

function getById(id) {
  return storageService.get(EMAIL_KEY, id);
}

function remove(id) {
  return storageService.remove(EMAIL_KEY, id);
}

function save(emailToSave) {
  if (emailToSave.id) {
    return storageService.put(EMAIL_KEY, emailToSave);
  } else {
    emailToSave.id = utilService.makeId(5);
    emailToSave.isOn = false; // Make sure all properties are set before saving
    return storageService.post(EMAIL_KEY, emailToSave);
  }
}

async function saveToStarred(emailToUpdate) {
  try {
    const email = await storageService.get(EMAIL_KEY, emailToUpdate.id);
    email.isStarred = true;
    return await storageService.put(EMAIL_KEY, email);
  } catch (error) {
    console.error('Failed to save to starred:', error);
    throw error;
  }
}

async function removeFromStarred(emailId) {
  try {
    const email = await storageService.get(EMAIL_KEY, emailId);
    email.isStarred = false;
    return await storageService.put(EMAIL_KEY, email);
  } catch (error) {
    console.error('Failed to remove from starred:', error);
    throw error;
  }
}

async function getStarredEmails() {
  const emails = await storageService.query(EMAIL_KEY);
  return emails.filter(email => email.isStarred);
}

async function createEmail(subject, body, isRead, isStarred, from, to) {
  const email = {
    id: utilService.makeId(5),
    subject,
    body,
    isRead,
    isStarred,
    sentAt: Date.now(),
    removedAt: null, // for later use
    from,
    to,
  };
  return storageService.post(EMAIL_KEY, email);
}

function _createDemoUser() {
  let user = utilService.loadFromStorage(USER_KEY);
  if (!user || !user.length) {
    user = [
      {
        email: 'info@digital-solution.co.il',
        fullname: 'Keinar Elkayam',
      },
    ];
    utilService.saveToStorage(USER_KEY, user);
  }
}

async function getDemoUser() {
  const user = await storageService.query(USER_KEY);
  return user;
}

function _createEmails() {
  let emails = utilService.loadFromStorage(EMAIL_KEY);
  if (!emails || !emails.length) {
    emails = [
      {
        id: utilService.makeId(5),
        subject: 'Miss you!',
        body: 'Would love to catch up sometimes',
        isRead: false,
        isStarred: false,
        sentAt: Date.now(),
        removedAt: null,
        from: 'momo@momo.com',
        to: 'user@appsus.com',
      },

      {
        id: utilService.makeId(5),
        subject: 'How are you?',
        body: 'Your Wednesday morning update',
        isRead: false,
        isStarred: false,
        sentAt: Date.now(),
        removedAt: null,
        from: 'momo@momo.com',
        to: 'user@appsus.com',
      },

      {
        id: utilService.makeId(5),
        subject: 'Please you help me',
        body: `We've saved a copy of Mister Email`,
        isRead: false,
        isStarred: false,
        sentAt: Date.now(),
        removedAt: null,
        from: 'momo@momo.com',
        to: 'user@appsus.com',
      },
    ];
    utilService.saveToStorage(EMAIL_KEY, emails);
  }
}
