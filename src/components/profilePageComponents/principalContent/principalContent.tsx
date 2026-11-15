import React from 'react';
import './principalContent.css';
import userIcon from "../../../assets/desktop/svg/userIcon.svg"
import { useRef } from 'react';
import { PRESET_AVATARS, UserAvatar } from '../../UserAvatar/UserAvatar';

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
  onNotifications: () => void;                 // HU56
  avatar: string;                              // HU14
  onSelectAvatar: (avatar: string) => void;
  onUploadAvatar: (file: File) => void;
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
  onNotifications,
  avatar,
  onSelectAvatar,
  onUploadAvatar,
  saving,
  isGoogleAccount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          {/* HU14 (CA2, CA3): subir foto JPG o PNG de máximo 2 MB */}
          <div className="avatarUpload" style={{ flexWrap: 'wrap' }}>
            <UserAvatar avatar={avatar} fallbackSrc={userIcon} className="userIcon" alt="Current Avatar" />
          {/* HU14 (CA1): avatares prediseñados de Capy */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }} role="radiogroup" aria-label="Capy avatars">
            {PRESET_AVATARS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={avatar === preset.id}
                aria-label={preset.label}
                onClick={() => onSelectAvatar(preset.id)}
                disabled={saving}
                style={{
                  width: '44px', height: '44px', padding: 0, borderRadius: '50%', cursor: 'pointer', background: 'none',
                  border: avatar === preset.id ? '3px solid #A8F25D' : '3px solid transparent'
                }}
              >
                <UserAvatar avatar={preset.id} fallbackSrc={userIcon} size="100%" alt={preset.label} />
              </button>
            ))}
          </div>

            <div
              className="uploadBox"
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click() }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) onUploadAvatar(file);
              }}
            >
              <p className="uploadText">
                <span className="clickHere">Click here</span> to upload your file or drag
              </p>
              <p className="uploadFormat">Supported Format: JPG, PNG (max 2 MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadAvatar(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        <div className="buttonsRow" style={{ flexWrap: 'wrap' }}>
          <button className="discardButton" onClick={onNotifications} disabled={saving}>Notifications 🔔</button>
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
