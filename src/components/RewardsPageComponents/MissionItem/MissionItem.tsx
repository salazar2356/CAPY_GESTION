import './MissionItem.css';

import logoWhite from '../../../assets/desktop/svg/logo/logoCapyMoneyWhite.svg';
import logoBlack from '../../../assets/desktop/svg/logo/logoCapyMoneyBlack.svg';
import { completeMission, getActionErrorMessage } from '../../../services/Firebase/FirestoreActions';
import { useContext, useState } from 'react';
import { showRewardToasts, showToast } from '../../../utils/toast';
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
    const OnChangeFirebase = useContext(ChangeFirebaseContext)
    const [busy, setBusy] = useState(false)

    // HU42: completar una misión solo si se cumple su condición
    const handleCompleteMission = async () => {
        if (isCompleted || busy) return;
        setBusy(true)
        try {
            const reward = await completeMission(OnChangeFirebase.logedUserUID, missionId)
            showRewardToasts(reward, `¡Misión "${missionTitle}" completada!`)
            await OnChangeFirebase.fetchAndSetUserData()
        } catch (err) {
            console.error(err)
            showToast(getActionErrorMessage(err), 'error')
        } finally {
            setBusy(false)
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
        <div className='MissionItemContainer' onClick={handleCompleteMission} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCompleteMission() }}
            style={{ cursor: isCompleted ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}
            title={isCompleted ? 'Completed' : 'Click to claim this mission'}>
            <div className='missionTextContainer'>
                <h3>{missionTitle}</h3>
                <p className='MissionDesc'>{text}</p>
            </div>
            {renderCapyPoints()}
        </div>
    );
};
