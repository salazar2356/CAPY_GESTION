import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth"; 
import { initializeFirestore } from "firebase/firestore";

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
setPersistence(auth, browserLocalPersistence);

// En muchos navegadores y redes de celular se bloquea la conexión continua (WebChannel)
// que Firestore usa por defecto, y las escrituras nunca llegan. Con long polling funciona en todos.
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

export { auth, db };