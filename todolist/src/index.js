import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>               {/* Store added */}
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results 
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
