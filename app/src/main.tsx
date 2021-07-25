import React from 'react';
import ReactDOM from 'react-dom';
import 'virtual:windi.css';
import '@purge-icons/generated';
import App from 'src/App';
import 'src/Lib/styles/lib.scss';
import 'src/Shared/styles/index.scss';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    {' '}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
