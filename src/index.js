import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';
import {BrowserRouter} from 'react-router-dom';

var config = {
    apiKey: "AIzaSyAD4Y2JeWmie88Q3RyATi_95puhaBwdWCk",
    authDomain: "firstlaravel-3c77b.firebaseapp.com",
    databaseURL: "https://firstlaravel-3c77b.firebaseio.com",
    projectId: "firstlaravel-3c77b",
    storageBucket: "firstlaravel-3c77b.appspot.com",
    messagingSenderId: "213179623319"
};

firebase.initializeApp(config);

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();