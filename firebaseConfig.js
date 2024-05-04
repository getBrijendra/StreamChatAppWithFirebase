import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBf6ddgVfBD-UeprIlNwCNcnuS0n4gG2Gs",
    authDomain: "chat-app-demo-bc24b.firebaseapp.com",
    databaseURL: "https://chat-app-demo-bc24b-default-rtdb.firebaseio.com",
    projectId: "chat-app-demo-bc24b",
    storageBucket: "chat-app-demo-bc24b.appspot.com",
    messagingSenderId: "747021367728",
    appId: "1:747021367728:web:2bd63a4a49ea25123cfe75",
    measurementId: "G-L1CD1F9G2S"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app }