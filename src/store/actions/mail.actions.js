import { mailService } from '../../services/mail.service';
import {
  ADD_MAIL,
  REMOVE_MAIL,
  SET_FILTER_BY,
  SET_IS_LOADING,
  SET_MAILS,
  UNDO_CHANGES,
  UPDATE_MAIL,
} from '../reducers/mail.reducer';
import { store } from '../store';

export async function loadMails() {
  const filterBy = store.getState().mailModule.filterBy;
  try {
    const mails = await mailService.query(filterBy);
    store.dispatch({ type: SET_MAILS, mails });
  } catch (err) {
    console.log('Had issues loading mails', err);
    throw err;
  } finally {
    // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
  }
}

export async function removeMail(mailId) {
  store.dispatch({ type: SET_IS_LOADING, isLoading: true });
  try {
    await mailService.remove(mailId);
    store.dispatch({ type: REMOVE_MAIL, mailId });
  } catch (err) {
    console.log('Had issues Removing mail', err);
    throw err;
  } finally {
    store.dispatch({ type: SET_IS_LOADING, isLoading: false });
  }
}

export async function removeMailOptimistic(mailId) {
  try {
    store.dispatch({ type: REMOVE_MAIL, mailId });
    await mailService.remove(mailId);
  } catch (err) {
    store.dispatch({ type: UNDO_CHANGES });
    console.log('Had issues Removing mail', err);
    throw err;
  }
}

export async function saveMail(mailToSave) {
  store.dispatch({ type: SET_IS_LOADING, isLoading: true });
  const type = mailToSave.id ? UPDATE_MAIL : ADD_MAIL;
  try {
    const savedMail = await mailService.save(mailToSave);
    store.dispatch({ type, mail: savedMail });
  } catch (err) {
    console.log('Had issues saving mail', err);
    throw err;
  } finally {
    store.dispatch({ type: SET_IS_LOADING, isLoading: false });
  }
}

export function setFilterBy(filterBy) {
  store.dispatch({ type: SET_FILTER_BY, filterBy });
}

export function setIsLoading(isLoading) {
  store.dispatch({ type: 'SET_IS_LOADING', isLoading });
}
