import { store } from '../store';

export async function spendBalance(amount) {
  try {
    store.dispatch({ type: 'SPEND_BALANCE', amount });
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
}
