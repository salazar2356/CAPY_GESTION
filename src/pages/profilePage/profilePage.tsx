import React, { useEffect, useState } from 'react';
import './profilePage.css';
import '../../components/ui/capyModal.css';
import { GlobalAppNav } from '../../components/Nav/Nav';
import { ProfileHeader } from '../../components/profilePageComponents/profileHeader/profileHeader';
import { GeneralContent } from '../../components/profilePageComponents/generalContent/generalContent';
import { PrincipalContent } from '../../components/profilePageComponents/principalContent/principalContent';
import userImageIcon from "../../../src/assets/desktop/svg/avatarHeader.svg"
import logOutButton from "../../../src/assets/desktop/svg/logOutButton.svg"
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { NavigationHook } from '../../hooks/navigationHook';
import { useUserFirebaseData } from '../../hooks/useUserFirebaseData';
import {
  doChangeEmail,
  doChangePassword,
  doDeleteAccount,
  doUpdateDisplayName,
  getAuthErrorMessage,
  isGoogleAccount,
  onAuthChange
} from '../../services/Firebase/auth';
import { getActionErrorMessage, sendFeedback } from '../../services/Firebase/FirestoreActions';
import { showToast } from '../../utils/toast';
import { getSaverLevelInfo } from '../../utils/saverLevels';

interface UserData {
  name: string;
  email: string;
  iconUrl: string;
  username: string;
  currentPassword: string;
  newPassword: string;
  rank: string;
}

export const ProfilePage: React.FC = () => {
  const userDataRedux = useSelector((state: RootState) => state.userData);
  const userExpGained = useSelector((state: RootState) => state.rewards.userExpGained);
  const rank = getSaverLevelInfo(userExpGained || 0).levelName;

  const { handleLogOut, handleNavigation } = NavigationHook();

  // Carga los datos de Firestore al entrar directo a esta página
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionStorageUserUID] = useState(() => sessionStorage.getItem('userUID'));
  const { fetchAndSetUserData } = useUserFirebaseData(sessionStorageUserUID);

  useEffect(() => {
    if (!isInitialized) {
      if (!sessionStorageUserUID) {
        handleNavigation.navigateToLogin();
      } else {
        fetchAndSetUserData();
      }
      setIsInitialized(true);
    }
  }, [isInitialized, handleNavigation, sessionStorageUserUID, fetchAndSetUserData]);

  const emptyForm = (): UserData => ({
    name: userDataRedux.userName,
    email: userDataRedux.userEmail,
    iconUrl: '',
    username: userDataRedux.userName,
    currentPassword: '',
    newPassword: '',
    rank,
  });

  const [userData, setUserData] = useState<UserData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [googleAccount, setGoogleAccount] = useState(false);

  // Modales
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  // Cuando llegan los datos de Firestore, se actualiza el formulario
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      name: userDataRedux.userName,
      email: userDataRedux.userEmail,
      username: userDataRedux.userName,
      rank,
    }));
  }, [userDataRedux.userName, userDataRedux.userEmail, rank]);

  // Firebase Auth tarda un momento en restaurar la sesión al recargar
  useEffect(() => {
    const unsubscribe = onAuthChange(() => setGoogleAccount(isGoogleAccount()));
    return unsubscribe;
  }, []);

  const handleChange = (field: 'username' | 'email' | 'currentPassword' | 'newPassword', value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleDiscard = () => setUserData(emptyForm());

  // HU12 (nombre y correo) y HU13 (contraseña)
  const handleSave = async () => {
    const newName = userData.username.trim();
    const newEmail = userData.email.trim();
    const nameChanged = newName !== userDataRedux.userName;
    const emailChanged = newEmail.toLowerCase() !== userDataRedux.userEmail.toLowerCase();
    const passwordChanged = userData.newPassword.length > 0;

    if (!nameChanged && !emailChanged && !passwordChanged) {
      showToast('No hay cambios para guardar.', 'info');
      return;
    }
    if (!newName) {
      showToast('El nombre no puede estar vacío.', 'error');
      return;
    }
    if (passwordChanged && userData.newPassword.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (nameChanged) {
        await doUpdateDisplayName(newName);
        showToast('Nombre actualizado', 'success');
      }
      if (emailChanged) {
        await doChangeEmail(newEmail, userData.currentPassword);
        showToast(`Te enviamos un enlace a ${newEmail}. El correo cambiará cuando lo confirmes.`, 'info', 7000);
      }
      if (passwordChanged) {
        await doChangePassword(userData.currentPassword, userData.newPassword);
        showToast('Contraseña actualizada', 'success');
      }
      await fetchAndSetUserData();
      setUserData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      console.error(err);
      showToast(getAuthErrorMessage(err), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  // HU58: eliminar cuenta (borra Firestore y luego Auth)
  const handleDeleteAccount = async () => {
    setDeleteError('');
    setSaving(true);
    try {
      await doDeleteAccount(googleAccount ? undefined : deletePassword);
      showToast('Tu cuenta fue eliminada.', 'info');
      handleNavigation.navigateToLanding();
    } catch (err) {
      console.error(err);
      setDeleteError(getAuthErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // HU60: opinión sobre Capy
  const handleSendFeedback = async () => {
    setFeedbackError('');
    setSaving(true);
    try {
      await sendFeedback(userDataRedux.userUID, userDataRedux.userEmail, rating, feedbackMessage);
      showToast('¡Gracias por tu opinión!', 'success');
      setShowFeedback(false);
      setRating(0);
      setFeedbackMessage('');
    } catch (err) {
      console.error(err);
      setFeedbackError(getActionErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page" id="profilePage">
      <h1 id="titleProfile">General settings</h1>
      <GlobalAppNav />

      <div className="contentWrapper">
        <img src={userImageIcon} alt="Current Avatar" className="avatarImage" />

        <div className="generalProfile">
          <ProfileHeader />

          <div className="content">
            <div className="generalContent">
              <GeneralContent
                name={userData.name}
                email={userData.email}
                rank={userData.rank}
              />
            </div>

            <div className="principalContent">
              <PrincipalContent
                username={userData.username}
                email={userData.email}
                currentPassword={userData.currentPassword}
                newPassword={userData.newPassword}
                onChange={handleChange}
                onSave={handleSave}
                onDiscard={handleDiscard}
                onDeleteAccount={() => { setDeleteError(''); setDeletePassword(''); setShowDelete(true); }}
                onFeedback={() => { setFeedbackError(''); setShowFeedback(true); }}
                saving={saving}
                isGoogleAccount={googleAccount}
              />
            </div>
          </div>
        </div>
        <button className="logOutButton" onClick={handleLogOut}>
          <img src={logOutButton} alt="Log Out Icon" className="logOutIcon" />
        </button>
      </div>

      {showDelete && (
        <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !saving) setShowDelete(false); }}>
          <div className="capyModal" role="alertdialog" aria-modal="true" aria-labelledby="deleteAccountTitle">
            <h3 id="deleteAccountTitle">Delete account</h3>
            <p>Se borrarán tu cuenta y todos tus datos (movimientos, metas, puntos y recompensas). Esta acción no se puede deshacer.</p>
            {deleteError && <p className="capyModalError">{deleteError}</p>}
            {googleAccount ? (
              <p>Para confirmar, se abrirá una ventana de Google.</p>
            ) : (
              <div className="capyModalField">
                <label htmlFor="deletePassword">Current password</label>
                <input id="deletePassword" type="password" autoComplete="current-password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
              </div>
            )}
            <div className="capyModalActions">
              <button type="button" className="capyBtnSecondary" onClick={() => setShowDelete(false)} disabled={saving}>Cancel</button>
              <button type="button" className="capyBtnDanger" onClick={handleDeleteAccount} disabled={saving}>
                {saving ? 'Deleting...' : 'Delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !saving) setShowFeedback(false); }}>
          <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby="feedbackTitle">
            <h3 id="feedbackTitle">What do you think of Capy?</h3>
            {feedbackError && <p className="capyModalError">{feedbackError}</p>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }} role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} stars`}
                  onClick={() => setRating(value)}
                  style={{ background: 'none', border: 'none', fontSize: '34px', cursor: 'pointer', color: value <= rating ? '#A8F25D' : 'rgba(249,249,249,0.35)' }}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="capyModalField">
              <label htmlFor="feedbackMessage">Comment (optional)</label>
              <textarea id="feedbackMessage" placeholder="Tell us what you like or what we can improve" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} />
            </div>
            <div className="capyModalActions">
              <button type="button" className="capyBtnSecondary" onClick={() => setShowFeedback(false)} disabled={saving}>Cancel</button>
              <button type="button" className="capyBtnPrimary" onClick={handleSendFeedback} disabled={saving}>{saving ? 'Sending...' : 'Send'}</button>
            </div>
          </div>
        </div>
      )}

      <div id="profileBackground" className="backgroundPage"></div>
    </main>
  );
};
