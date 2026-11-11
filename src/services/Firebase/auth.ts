import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  updatePassword,
  verifyBeforeUpdateEmail,
  deleteUser,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { getRealUser, updateUserName, updateUserEmail, deleteUserData } from "./FirestoreUsers";

// Proveedor de Google reutilizable
const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
};

// Registrar usuarios con email y contraseña (y guardar el nombre en el perfil de Auth).
// El documento en Firestore ("realUsers") lo crea CardRegister con createFinalUser().
export const doCreateUserWithEmailAndPassword = async (email: string, password: string, displayName?: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  return credential;
};

// Iniciar sesión con email y contraseña.
// Si el usuario confirmó un cambio de correo, actualiza también el correo en Firestore.
export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  await syncEmailWithFirestore(credential.user);
  return credential;
};

// Iniciar sesión / registrarse con Google
export const doGoogleSignIn = async () => {
  const result = await signInWithPopup(auth, createGoogleProvider());
  await syncEmailWithFirestore(result.user);
  return result;
};

// Cerrar sesión y limpiar los datos guardados en el navegador
export const doSignOut = async () => {
  await signOut(auth);
  sessionStorage.removeItem("userUID");
  sessionStorage.removeItem("userData");
};

// Escuchar cambios de sesión (útil en App.tsx para mantener la sesión al recargar)
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Enviar correo para recuperar contraseña (HU06)
export const doPasswordReset = async (email: string) => {
  if (!email.trim()) throw { code: "auth/missing-email" };
  await sendPasswordResetEmail(auth, email.trim());
};

// ¿La cuenta actual se creó con Google (sin contraseña)?
export const isGoogleAccount = () => {
  return !!auth.currentUser?.providerData.some((p) => p.providerId === "google.com") &&
    !auth.currentUser?.providerData.some((p) => p.providerId === "password");
};

// Si el correo de Auth cambió (por verifyBeforeUpdateEmail), lo copia a Firestore ("realUsers").
// Si falla, no impide el inicio de sesión.
const syncEmailWithFirestore = async (user: User) => {
  try {
    if (!user.email) return;
    const data = await getRealUser(user.uid);
    if (data && data.email !== user.email) {
      await updateUserEmail(user.uid, user.email);
    }
  } catch (err) {
    console.warn("No se pudo sincronizar el correo con Firestore:", err);
  }
};

// Vuelve a autenticar al usuario (Firebase lo exige para cambiar contraseña, correo o borrar la cuenta)
const reauthenticate = async (currentPassword?: string) => {
  const user = auth.currentUser;
  if (!user) throw { code: "auth/no-current-user" };

  if (isGoogleAccount()) {
    await reauthenticateWithPopup(user, createGoogleProvider());
  } else {
    if (!currentPassword) throw { code: "auth/missing-password" };
    const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
    await reauthenticateWithCredential(user, credential);
  }
};

// Actualizar nombre en Firebase Auth Y en Firestore (HU12)
export const doUpdateDisplayName = async (name: string) => {
  const user = auth.currentUser;
  if (!user) throw { code: "auth/no-current-user" };
  const cleanName = name.trim();
  await updateProfile(user, { displayName: cleanName });
  await updateUserName(user.uid, cleanName);
};

// Cambiar correo: Firebase envía un enlace de confirmación al correo nuevo (HU12).
// Firestore se actualiza en el siguiente inicio de sesión, cuando el cambio ya está confirmado.
export const doChangeEmail = async (newEmail: string, currentPassword?: string) => {
  if (!newEmail.trim()) throw { code: "auth/missing-email" };
  await reauthenticate(currentPassword);
  await verifyBeforeUpdateEmail(auth.currentUser!, newEmail.trim());
};

// Cambiar contraseña (HU13)
export const doChangePassword = async (currentPassword: string, newPassword: string) => {
  if (isGoogleAccount()) throw { code: "auth/google-account" };
  await reauthenticate(currentPassword);
  await updatePassword(auth.currentUser!, newPassword);
};

// Eliminar la cuenta completa (HU58): reautentica, borra Firestore y luego Auth
export const doDeleteAccount = async (currentPassword?: string) => {
  await reauthenticate(currentPassword);
  const user = auth.currentUser;
  if (!user) throw { code: "auth/no-current-user" };
  await deleteUserData(user.uid); // primero Firestore (después ya no habría permiso)
  await deleteUser(user);
  sessionStorage.removeItem("userUID");
  sessionStorage.removeItem("userData");
};

// Se dejan por compatibilidad si ya los usas en otro componente
export const doReauthenticateForDelete = async (currentPassword?: string) => {
  await reauthenticate(currentPassword);
};

export const doDeleteAuthUser = async () => {
  if (!auth.currentUser) throw { code: "auth/no-current-user" };
  await deleteUser(auth.currentUser);
};

// Traduce los códigos de error de Firebase a mensajes legibles
export const getAuthErrorMessage = (err: unknown): string => {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use": return "Este correo ya está registrado. Inicia sesión.";
    case "auth/invalid-email": return "El correo no es válido.";
    case "auth/weak-password": return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Correo o contraseña incorrectos.";
    case "auth/user-disabled": return "Esta cuenta fue deshabilitada.";
    case "auth/too-many-requests": return "Demasiados intentos. Intenta de nuevo más tarde.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request": return "Cerraste la ventana de Google antes de terminar.";
    case "auth/popup-blocked": return "El navegador bloqueó la ventana emergente de Google. Permítela e intenta de nuevo.";
    case "auth/account-exists-with-different-credential": return "Ya existe una cuenta con este correo usando otro método de acceso.";
    case "auth/unauthorized-domain": return "Dominio no autorizado en Firebase (Authentication > Settings > Authorized domains).";
    case "auth/operation-not-allowed": return "Este método de acceso no está habilitado en Firebase (Authentication > Sign-in method).";
    case "auth/network-request-failed": return "Error de red. Revisa tu conexión.";
    case "auth/missing-password": return "Escribe tu contraseña actual para confirmar.";
    case "auth/requires-recent-login": return "Por seguridad, vuelve a iniciar sesión e inténtalo de nuevo.";
    case "auth/user-mismatch": return "La cuenta de Google elegida no es la misma con la que iniciaste sesión.";
    case "auth/google-account": return "Tu cuenta usa Google, por eso no tiene contraseña para cambiar.";
    case "auth/no-current-user": return "Tu sesión expiró. Inicia sesión de nuevo.";
    case "auth/missing-email": return "Escribe tu correo.";
    case "permission-denied": return "Firestore rechazó la operación (revisa las reglas de seguridad).";
    case "unavailable": return "No se pudo conectar con la base de datos. Revisa tu conexión.";
    case "not-found": return "No se encontraron los datos del usuario.";
    default: return `Error: ${code || (err as Error)?.message || "desconocido"}`;
  }
};