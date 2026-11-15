import './Missions.css';

import { MissionItem } from '../MissionItem/MissionItem';
import { WeeklyMissionItem } from '../WeeklyMissionItem/WeeklyMissionItem';
import { missionType } from '../../../store/rewards/types';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { getWeekStartKey } from '../../../utils/weeklyMissions';

export const Missions = () => {
  const missionsData: missionType[] = useSelector((state: RootState) => state.rewards.missions);
  const weeklyMissions = useSelector((state: RootState) => state.rewards.weeklyMissions);

  // Filtra las misiones incompletas, ordénalas y toma solo los primeros tres elementos
  const filteredAndSortedMissions = missionsData
    .filter(mission => !mission.completed)
    .sort((a, b) => a.missionId - b.missionId)
    .slice(0, 3); // Tomar los primeros tres elementos

  // HU43: solo se muestran las misiones de la semana actual
  const currentWeekly = weeklyMissions.weekStart === getWeekStartKey() ? weeklyMissions.missions : [];

  return (
    <div className='missions'>
      <div className="info-container">
        <h2>Missions</h2>
        <div id='missionItemContainer'>
          {currentWeekly.map((mission) => (
            <WeeklyMissionItem key={mission.id} mission={mission} weekStart={weeklyMissions.weekStart} />
          ))}
          {filteredAndSortedMissions.length === 0 && currentWeekly.length === 0 && (
            <p>🎉 You completed all your missions!</p>
          )}
          {filteredAndSortedMissions.map((mission) => (
            <MissionItem
              key={mission.missionId}
              text={mission.missionDescription}
              gainAmount={String(mission.missionCapypoints)}
              backgroundColor={mission.missionColor}
              capyPointsDark={false}
              isCompleted={mission.completed}
              expToGrant={mission.missionExp}
              missionId={mission.missionId}
              missionTitle={mission.missionName} />
          ))}
        </div>
      </div>
    </div>
  );
};
