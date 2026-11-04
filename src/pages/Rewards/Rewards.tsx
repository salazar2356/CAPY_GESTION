import './Rewards.css';

import React, { useEffect, useState } from 'react';
import RewardGrid from '../../components/RewardsPageComponents/RewardGrid/RewardGrid';
import { Missions } from '../../components/RewardsPageComponents/Missions/Missions';
import { SaverLevel } from '../../components/RewardsPageComponents/SaverLevel/SaverLevel';
import { GlobalAppNav } from '../../components/Nav/Nav';
import Summary from '../../components/RewardsPageComponents/Summary/Summary';
import { NavigationHook } from '../../hooks/navigationHook';
import { useUserFirebaseData } from '../../hooks/useUserFirebaseData';
import { ChangeFirebaseContext } from '../../Contexts/changeFirebaseContext';
import { CapyAssistant } from '../../components/capyAssistantComponent/capyAssistantComponent';

export const Rewards: React.FC = () => {

  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionStorageUserUID] = useState(() => sessionStorage.getItem('userUID'));
  const { handleNavigation } = NavigationHook();
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

  if (sessionStorageUserUID) {
    return (
      <ChangeFirebaseContext.Provider value={{
        setIsInitialized: setIsInitialized,
        fetchAndSetUserData: fetchAndSetUserData,
        logedUserUID: sessionStorageUserUID
      }}>

        <main className="reward-container">
          <h1 id='principal'>Reward</h1>
          <div className='MissionLevel'>


            <GlobalAppNav></GlobalAppNav>

            <div className='iqual'>
              <Missions></Missions>
            </div>

            <div className='iqual'>
              <SaverLevel></SaverLevel>
            </div>

            <div className='iqual'>
              <Summary></Summary>
            </div>

          </div>

          <div className='canjeo'>
            <RewardGrid></RewardGrid>
          </div>

          <div id='backgroundReward' className='backgroundPage'>

          </div>
          <CapyAssistant />
        </main>
      </ChangeFirebaseContext.Provider>
    );
  }
}

