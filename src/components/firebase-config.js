// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 사용자 인증
import { getFirestore } from 'firebase/firestore'; // 파이어스토어
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCcCKLTlp8AfQcAo8FcS1mzQG9oVjuoB0",
    authDomain: "react-diary-45e64.firebaseapp.com",
    projectId: "react-diary-45e64",
    storageBucket: "react-diary-45e64.appspot.com",
    messagingSenderId: "422928668881",
    appId: "1:422928668881:web:523de178c0e8a6650a0df0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 사용자 인증
export const db = getFirestore(app); // Firestore 앱 초기화 후 내보내기