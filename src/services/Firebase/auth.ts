import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import { ensureRealUser } from './FirestoreUsers';

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

export const doRegister = async (name: string, email: string, password: string) => {
  const credential = await doCreateUserWithEmailAndPassword(email.trim(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  await ensureRealUser(credential.user, name);
  return credential;
};

export const doSignOut = () => signOut(auth);
export const doPasswordReset = (email: string) => sendPasswordResetEmail(auth, email.trim());

export const authErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) return 'No se pudo completar la operación. Inténtalo de nuevo.';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/invalid-email': 'Ingresa un correo válido.',
    'auth/email-already-in-use': 'Este correo ya está registrado. Inicia sesión.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/password-does-not-meet-requirements': 'La contraseña no cumple los requisitos de seguridad.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
    'auth/network-request-failed': 'Comprueba tu conexión a internet.',
    'auth/popup-closed-by-user': 'Se cerró la ventana de Google antes de terminar.',
    'auth/popup-blocked': 'Permite las ventanas emergentes para iniciar sesión con Google.',
    'auth/unauthorized-domain': 'El acceso con Google aún no está habilitado para este dominio.',
    'auth/operation-not-allowed': 'Este método de acceso aún no está habilitado.',
  };
  return messages[error.code] || 'No se pudo completar la operación. Inténtalo de nuevo.';
};
