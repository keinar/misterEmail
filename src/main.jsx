import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './assets/css/index.scss';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
  <App />
  </Provider>
  // </React.StrictMode>,
);
