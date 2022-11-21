import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import './css/style.css';
import './css/reset.css';
import './css/loading.css';
import './css/work-calendar.css';
import './css/work-calendar-full.css';
import './css/custom.css';
import './css/table.css';
import './css/modal.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
);
