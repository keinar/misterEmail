import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
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
    getFormattedDateTime
}

const EMAIL_KEY = 'emails'
const USER_KEY = 'loggedInUser'
const STARRED_KEY = 'starred-emails'
       

_createEmails()
_createDemoUser()


function getDefaultFilter(){
    return{
        status: '', // inbox/sent/star/trash
        txt: '', // no need to support complex text search
        isRead: null, // false/true/null (optional property, if missing: show all)
    }
}

async function query(filterBy) {
    const emails = await storageService.query(EMAIL_KEY)
    if (filterBy) {
        
        let filteredEmails = emails;

        if (filterBy.txt) {
            filteredEmails = filteredEmails.filter(email => 
                email.subject.toLowerCase().includes(filterBy.txt.toLowerCase())
            );
        }

        // if (filterBy.status) {
        //     filteredEmails = filteredEmails.filter(email => 
             
        //     );
        // }
        if (filterBy.isRead === true) {
            filteredEmails = filteredEmails.filter(email => 
                email.isRead === filterBy.isRead
            );
        }

        return filteredEmails;
    }

    return emails
}

function getById(id) {
    return storageService.get(EMAIL_KEY, id)
}

function remove(id) {
    return storageService.remove(EMAIL_KEY, id)
}

function save(emailToSave) {
    if (emailToSave.id) {
        return storageService.put(EMAIL_KEY, emailToSave)
    } else {
        emailToSave.id = utilService.makeId(5);
        emailToSave.isOn = false // Make sure all properties are set before saving
        return storageService.post(EMAIL_KEY, emailToSave)
    }
}

async function saveToStarred(emailId) {
    return storageService.get(EMAIL_KEY, emailId)
        .then(email => {
            email.isStarred = true;
            return storageService.put(EMAIL_KEY, email);
        });
}

async function removeFromStarred(emailId) {
    return storageService.get(EMAIL_KEY, emailId)
        .then(email => {
            email.isStarred = false;
            return storageService.put(EMAIL_KEY, email);
        });
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
        sentAt: getFormattedDateTime(),
        removedAt: null, // for later use
        from,
        to
    };
    return storageService.post(EMAIL_KEY, email)
}

function getFormattedDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const monthIndex = now.getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[monthIndex];
    return `${day} ${month} ${hours}:${minutes}`;
  }

  function _createDemoUser(){
    let user = utilService.loadFromStorage(USER_KEY)
    if(!user || !user.length){
        user = [
            {
            email: 'info@digital-solution.co.il',
            fullname: 'Keinar Elkayam'
            }
        ]
        utilService.saveToStorage(USER_KEY, user)
    }
  }

  async function getDemoUser(){
    const user = await storageService.query(USER_KEY)
    return user
  }

    
function _createEmails() {
    let emails = utilService.loadFromStorage(EMAIL_KEY)
    if (!emails || !emails.length) {
        emails = [
            { id: utilService.makeId(5),
            subject: 'Miss you!',
            body: 'Would love to catch up sometimes',
            isRead: false,
            isStarred: false,
            sentAt : getFormattedDateTime(),
            removedAt : null, //for later use
            from: 'momo@momo.com',
            to: 'user@appsus.com' },
            
            { id: utilService.makeId(5),
            subject: 'How are you?',
            body: 'Would love to catch up sometimes',
            isRead: false,
            isStarred: false,
            sentAt : getFormattedDateTime(),
            removedAt : null, //for later use
            from: 'momo@momo.com',
            to: 'user@appsus.com' },

            { id: utilService.makeId(5),
            subject: 'Please you help me',
            body: 'Would love to catch up sometimes',
            isRead: false,
            isStarred: false,
            sentAt : getFormattedDateTime(),
            removedAt : null, //for later use
            from: 'momo@momo.com',
            to: 'user@appsus.com' },
        ]
        utilService.saveToStorage(EMAIL_KEY, emails)
    }
}




