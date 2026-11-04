import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  

const firebaseConfig = {
  apiKey: "AIzaSyBNAESpri0mINihGsyTlILve1fAk7kVjAc",
  authDomain: "capy-b8cd4.firebaseapp.com",
  projectId: "capy-b8cd4",
  storageBucket: "capy-b8cd4.firebasestorage.app",
  messagingSenderId: "615712345715",
  appId: "1:615712345715:web:ed4598e09cee8c2d2a2406",
  measurementId: "G-C67MSV4QLS"
};

export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
