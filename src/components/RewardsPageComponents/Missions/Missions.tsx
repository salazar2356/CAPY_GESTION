import './Missions.css';

import { MissionItem } from '../MissionItem/MissionItem';
import { missionType } from '../../../store/rewards/types';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';

export const Missions = () => {
  const missionsData: missionType[] = useSelector((state: RootState) => state.rewards.missions);

  // Filtra las misiones incompletas, ordénalas y toma solo los primeros tres elementos
  const filteredAndSortedMissions = missionsData
    .filter(mission => !mission.completed)
    .sort((a, b) => a.missionId - b.missionId)
    .slice(0, 3); // Tomar los primeros tres elementos

  return (
    <div className='missions'>
      <div className="info-container">
        <h2>Missions</h2>
        <div id='missionItemContainer'>
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
