const initialState = {
  loggedInUser: {
    name: 'Jorji',
    balance: 10000,
  },
};

export function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SPEND_BALANCE': {
      const { loggedInUser } = state;
      return {
        ...state,
        loggedInUser: {
          ...loggedInUser,
          balance: loggedInUser.balance - action.amount,
        },
      };
    }
    default:
      return state;
  }
}
