// HU43: misión semanal con días restantes y progreso
import '../MissionItem/MissionItem.css';

import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import logoWhite from '../../../assets/desktop/svg/logo/logoCapyMoneyWhite.svg';
import logoBlack from '../../../assets/desktop/svg/logo/logoCapyMoneyBlack.svg';
import { RootState } from '../../../store/store';
import { weeklyMissionType } from '../../../store/rewards/types';
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext';
import { completeWeeklyMission, getActionErrorMessage } from '../../../services/Firebase/FirestoreActions';
import { getDaysLeft, getWeeklyMissionProgress } from '../../../utils/weeklyMissions';
import { showRewardToasts, showToast } from '../../../utils/toast';

interface WeeklyMissionItemProps {
    mission: weeklyMissionType,
    weekStart: string
}

export const WeeklyMissionItem = ({ mission, weekStart }: WeeklyMissionItemProps) => {
    const OnChangeFirebase = useContext(ChangeFirebaseContext);
    const pointsHistory = useSelector((state: RootState) => state.rewards.pointsHistory);
    const userUID = useSelector((state: RootState) => state.userData.userUID);
    const [busy, setBusy] = useState(false);

    const progress = Math.min(
        mission.target,
        getWeeklyMissionProgress(mission, weekStart, pointsHistory.map((h) => ({ date: new Date(h.date), reason: h.reason })))
    );
    const daysLeft = getDaysLeft(weekStart);
    const dark = mission.color === '#A8F25D' || mission.color === '#CCFC56';

    const handleClaim = async () => {
        if (mission.completed || busy) return;
        setBusy(true);
        try {
            const reward = await completeWeeklyMission(OnChangeFirebase.logedUserUID || userUID, mission.id);
            showRewardToasts(reward, `¡Misión semanal "${mission.name}" completada!`);
            await OnChangeFirebase.fetchAndSetUserData();
        } catch (err) {
            console.error(err);
            showToast(getActionErrorMessage(err), 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className='MissionItemContainer' onClick={handleClaim} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClaim() }}
            style={{ cursor: mission.completed ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}
            title={mission.completed ? 'Completed' : 'Click to claim this weekly mission'}>
            <div className='missionTextContainer'>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#A8F25D' }}>
                    WEEKLY · {mission.completed ? 'Completed' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`}
                </p>
                <h3>{mission.name}</h3>
                <p className='MissionDesc'>{mission.description} ({progress}/{mission.target})</p>
            </div>
            <div className={`MissionCapyPoints ${dark ? '' : 'light'}`} style={{ backgroundColor: mission.color }}>
                <img src={dark ? logoBlack : logoWhite} alt="" />
                <div className={`CapyPointsAmount ${dark ? 'dark' : ''}`}>
                    <p className='Capypoints'>{mission.completed ? 'Completed' : 'Capypoints'}</p>
                    <p className='Gain'>+{mission.capypoints}</p>
                </div>
            </div>
        </div>
    );
};
