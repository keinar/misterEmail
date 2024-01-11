export const SET_MAILS = 'SET_MAILS';
export const ADD_MAIL = 'ADD_MAIL';
export const UPDATE_MAIL = 'UPDATE_MAIL';
export const REMOVE_MAIL = 'REMOVE_MAIL';
export const SET_FILTER_BY = 'SET_FILTER_BY';
export const UNDO_CHANGES = 'UNDO_CHANGES';
export const SET_IS_LOADING = 'SET_IS_LOADING';

const initialState = {
  mails: null,
  filterBy: {},
  isLoading: false,
  lastMails: [],
};

export function mailReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_MAILS:
      return {
        ...state,
        mails: action.mails,
      };
    case ADD_MAIL:
      return {
        ...state,
        mails: [...state.mails, action.mail],
        lastMails: [...state.mails],
      };
    case UPDATE_MAIL:
      return {
        ...state,
        mails: state.mails.map(mail =>
          mail.id === action.mail.id ? action.mail : mail
        ),
      };
    case REMOVE_MAIL:
      return {
        ...state,
        mails: state.mails.filter(mail => mail.id !== action.mailId),
        lastMails: [...state.mails],
      };
    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: { ...action.filterBy },
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UNDO_CHANGES:
      return {
        ...state,
        mails: [...state.lastMails],
      };

    default:
      return state;
  }
}
