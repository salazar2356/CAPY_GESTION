import React from 'react';
import './principalContent.css';
import userIcon from "../../../assets/desktop/svg/userIcon.svg"

interface PrincipalContentProps {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  onChange: (field: 'username' | 'email' | 'currentPassword' | 'newPassword', value: string) => void;
}

export const PrincipalContent: React.FC<PrincipalContentProps> = ({
  username,
  email,
  currentPassword,
  newPassword,
  onChange,

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
          <p className="sectionSubtitle">Modify your current password</p>
          <div className="inputRow">
            <div className="inputGroup">
              <label htmlFor="currentPassword" className="inputLabel">Current password</label>
              <div className="passwordInputWrapper">
                <input
                  id="currentPassword"
                  className="inputField"
                  type="password"
                  value={currentPassword}
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

        <div className="buttonsRow">
          <button className="discardButton">Discard</button>
          <button className="saveButton">Save changes</button>
        </div>
      </section>
    </div>
  );
};
