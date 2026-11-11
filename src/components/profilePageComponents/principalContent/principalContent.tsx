import React from 'react';
import './principalContent.css';
import userIcon from "../../../assets/desktop/svg/userIcon.svg"

interface PrincipalContentProps {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  onChange: (field: 'username' | 'email' | 'currentPassword' | 'newPassword', value: string) => void;
  onSave: () => void;
  onDiscard: () => void;
  onDeleteAccount: () => void;
  onFeedback: () => void;
  onPremium: () => void;
  saving: boolean;
  isGoogleAccount: boolean;
}

export const PrincipalContent: React.FC<PrincipalContentProps> = ({
  username,
  email,
  currentPassword,
  newPassword,
  onChange,
  onSave,
  onDiscard,
  onDeleteAccount,
  onFeedback,
  onPremium,
  saving,
  isGoogleAccount,
}) => {

  return (
    <div className="settingsPage">
      <section className="inputsSection">

        <div className="inputRow">
          <div className="inputGroup">
            <label htmlFor="username" className="inputLabel">User</label>
            <input
              id="username"
              className="inputField"
              type="text"
              value={username}
              onChange={(e) => onChange('username', e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="email" className="inputLabel">Email Address</label>
            <input
              id="email"
              className="inputField"
              type="email"
              value={email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
        </div>

        <div className="passwordSection">
          <h3 className="sectionTitle">Password</h3>
          <p className="sectionSubtitle">
            {isGoogleAccount
              ? 'Your account uses Google, so it has no password to change.'
              : 'Write your current password to change your email or password'}
          </p>
          <div className="inputRow">
            <div className="inputGroup">
              <label htmlFor="currentPassword" className="inputLabel">Current password</label>
              <div className="passwordInputWrapper">
                <input
                  id="currentPassword"
                  className="inputField"
                  type="password"
                  value={currentPassword}
                  disabled={isGoogleAccount}
                  autoComplete="current-password"
                  onChange={(e) => onChange('currentPassword', e.target.value)}
                />
              </div>
            </div>
            <div className="inputGroup">
              <label htmlFor="newPassword" className="inputLabel">New password</label>
              <input
                id="newPassword"
                className="inputField"
                type="password"
                value={newPassword}
                disabled={isGoogleAccount}
                autoComplete="new-password"
                onChange={(e) => onChange('newPassword', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="avatarSection">
          <h3 className="sectionTitle">Change Avatar</h3>
          <div className="avatarUpload">
            <img src={userIcon} alt="Current Avatar" className="userIcon" />
            <div className="uploadBox">
              <p className="uploadText">
                <span className="clickHere">Click here</span> to upload your file or drag
              </p>
              <p className="uploadFormat">Supported Format: SVG, JPG, PNG</p>
            </div>
          </div>
        </div>

        <div className="buttonsRow" style={{ flexWrap: 'wrap' }}>
          <button className="discardButton" onClick={onPremium} disabled={saving}>Capy Premium ✨</button>
          <button className="discardButton" onClick={onFeedback} disabled={saving}>Give feedback</button>
          <button className="discardButton" onClick={onDeleteAccount} disabled={saving} style={{ borderColor: '#F2622E', color: '#F2622E' }}>Delete account</button>
          <button className="discardButton" onClick={onDiscard} disabled={saving}>Discard</button>
          <button className="saveButton" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </section>
    </div>
  );
};
