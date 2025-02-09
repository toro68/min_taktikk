import React from 'react';
import ReactDOM from 'react-dom/client';
import FootballAnimator from './football-animator';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Finner ikke et element med id "root" i index.html');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FootballAnimator />
  </React.StrictMode>
); 