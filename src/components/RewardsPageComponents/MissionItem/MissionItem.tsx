import './MissionItem.css';

import { useSelector } from 'react-redux';

import logoWhite from '../../../assets/desktop/svg/logo/logoCapyMoneyWhite.svg';
import logoBlack from '../../../assets/desktop/svg/logo/logoCapyMoneyBlack.svg';
import { updateCompletedMission } from '../../../services/Firebase/FirestoreUsers';
import { RootState } from '../../../store/store';
import { useContext } from 'react';
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext';

interface MissionItemProps {
    text: string;
    gainAmount: string;
    backgroundColor: string;
    capyPointsDark: boolean;
    isCompleted: boolean;
    expToGrant: number,
    missionId: number,
    missionTitle: string
}

export const MissionItem = ({ text, gainAmount, backgroundColor, capyPointsDark, isCompleted, missionId, missionTitle }: MissionItemProps) => {
    const userUID = useSelector((state: RootState) => state.userData.userUID);
    const { missions, userExpGained, summary, } = useSelector((state: RootState) => state.rewards);
    const OnChangeFirebase = useContext(ChangeFirebaseContext)

    const handleCompleteMission = () => {
        if (!isCompleted) {
            updateCompletedMission(userUID, missionId, missions, userExpGained, summary.goalsCompleted, summary.accumulatedCapypoints, OnChangeFirebase.fetchAndSetUserData)
            OnChangeFirebase.setIsInitialized(false)
        }
    };

    const renderCapyPoints = () => {
        const logo = capyPointsDark || backgroundColor === '#CCFC56' ? logoBlack : logoWhite;
        const statusText = isCompleted ? 'Completed' : 'Capypoints';
        const className = isCompleted ? 'CapyPointsAmount' : `CapyPointsAmount ${capyPointsDark || backgroundColor === '#CCFC56' ? 'dark' : ''}`;

        return (
            <div className={`MissionCapyPoints ${!capyPointsDark ? 'light' : ''}`} style={{ backgroundColor }}>
                <img src={logo} alt="" />
                <div className={className}>
                    <p className='Capypoints'>{statusText}</p>
                    <p className='Gain'>+{gainAmount}</p>
                </div>
            </div>
        );
    };

    return (
        <div className='MissionItemContainer' onClick={handleCompleteMission}>
            <div className='missionTextContainer'>
                <h3>{missionTitle}</h3>
                <p className='MissionDesc'>{text}</p>
            </div>
            {renderCapyPoints()}
        </div>
    );
};
