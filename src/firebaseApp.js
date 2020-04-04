import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyAGHNNPXxTDAgG6wpL5TxlFVcBV8X6T8dg",
    authDomain: "scrum-board-b1d2f.firebaseapp.com",
    databaseURL: "https://scrum-board-b1d2f.firebaseio.com",
    projectId: "scrum-board-b1d2f",
    storageBucket: "scrum-board-b1d2f.appspot.com",
    messagingSenderId: "207954476199",
    appId: "1:207954476199:web:91f8de16331dbae3646f82",
    measurementId: "G-VW9VT4MR03"
};
firebase.initializeApp(config);
export default firebase;
