import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBffwejJUJJ886NS0n4gG2Gs",
    authDomain: "chat-app-demo-bc2f4b.firebaseapp.com",
    databaseURL: "https://chat-app-demo-bc24b-default-rtdb.firebaseio.com",
    projectId: "chat-app-demo-bc24b",
    storageBucket: "chat-app-demo-berc24b.appspot.com",
    messagingSenderId: "5345634636234",
    appId: "1:22321436774343:web:brthe34564634tl4t6dfv",
    measurementId: "G-L1CDGGUJ342S"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app }
