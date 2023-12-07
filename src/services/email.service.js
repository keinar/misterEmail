import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    query,
    save,
    remove,
    getById,
    createEmail,
    getDefaultFilter
}

const STORAGE_KEY = 'emails'

    // const loggedinUser = {
    //     email: 'user@appsus.com',
    //     fullname: 'Mahatma Appsus'
    //    }
       

_createEmails()


function getDefaultFilter(){
    return{
        status: '', // inbox/sent/star/trash
        txt: '', // no need to support complex text search
        isRead: null, // false/true/null (optional property, if missing: show all)
    }
}

async function query(filterBy) {
    const emails = await storageService.query(STORAGE_KEY)
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
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function save(emailToSave) {
    if (emailToSave.id) {
        return storageService.put(STORAGE_KEY, emailToSave)
    } else {
        emailToSave.isOn = false
        return storageService.post(STORAGE_KEY, emailToSave)
    }
}

function createEmail(id = '', subject = '', body = '', isRead = false,  isStarred = false,
sentAt = Date.now(),
removedAt = null, //for later use
from= '',
to= '') {
    return {
        id,
        subject,
        body,
        isRead,
        isStarred,
        sentAt,
        removedAt,
        from,
        to
    }
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

    
function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY)
    if (!emails || !emails.length) {
        emails = [
            { id: 'e101',
            subject: 'Miss you!',
            body: 'Would love to catch up sometimes',
            isRead: false,
            isStarred: false,
            sentAt : getFormattedDateTime(),
            removedAt : null, //for later use
            from: 'momo@momo.com',
            to: 'user@appsus.com' },
            
            { id: 'e103',
            subject: 'How are you?',
            body: 'Would love to catch up sometimes',
            isRead: true,
            isStarred: false,
            sentAt : getFormattedDateTime(),
            removedAt : null, //for later use
            from: 'momo@momo.com',
            to: 'user@appsus.com' },

            { id: 'e105',
            subject: 'Please you help me',
            body: 'Would love to catch up sometimes',
            isRead: false,
            isStarred: false,
            sentAt : getFormattedDateTime(),
            removedAt : null, //for later use
            from: 'momo@momo.com',
            to: 'user@appsus.com' },
        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}




