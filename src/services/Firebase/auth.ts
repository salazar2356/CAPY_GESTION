import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Función para registrar usuarios con email y contraseña
export const doCreateUserWithEmailAndPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Función para iniciar sesión con email y contraseña
export const doSignInWithEmailAndPassword = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Función para iniciar sesión/registrar con Google
export const doGoogleSignIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
