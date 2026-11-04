import React, { useState } from 'react';
import './profilePage.css';
import { GlobalAppNav } from '../../components/Nav/Nav';
import { ProfileHeader } from '../../components/profilePageComponents/profileHeader/profileHeader';
import { GeneralContent } from '../../components/profilePageComponents/generalContent/generalContent';
import { PrincipalContent } from '../../components/profilePageComponents/principalContent/principalContent';
import userImageIcon from "../../../src/assets/desktop/svg/avatarHeader.svg"
import logOutButton from "../../../src/assets/desktop/svg/logOutButton.svg"
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { NavigationHook } from '../../hooks/navigationHook';

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
  const userDataRewards = useSelector((state: RootState) => state.rewards.summary.saverLevel);

  const { handleLogOut } = NavigationHook();

  const [userData, setUserData] = useState<UserData>({
    name: userDataRedux.userName,
    email: userDataRedux.userEmail,
    iconUrl: '',
    username: userDataRedux.userName,
    currentPassword: '',
    newPassword: '',
    rank: userDataRewards,
  });



  const handleChange = (field: 'username' | 'email' | 'currentPassword' | 'newPassword', value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value
    }));
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
              />
            </div>
          </div>
        </div>
        <button className="logOutButton" /*onClick={handleLogOut}*/ >

          <img src={logOutButton} alt="Log Out Icon" className="logOutIcon" onClick={() => { handleLogOut() }} />
        </button>
      </div>

      <div id="profileBackground" className="backgroundPage"></div>
    </main>
  );
}; 