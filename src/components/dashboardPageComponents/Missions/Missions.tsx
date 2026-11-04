import './Missions.css';

import { MissionItem } from '../MissionItem/MissionItem';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'

export const Missions = () => {
  return (
    <>
      <div className='missionsDashboard'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />
        <div className="info-container">
          <h3>Missions</h3>
          <div id='missionItemContainer'>
            <MissionItem text={'Complete all monthly missions.'} gainAmount={'500'} backgroundColor={'#2D18BF'} capyPointsDark={false} isCompleted={false}></MissionItem>
            <MissionItem text={'Save at least 35% of your income this month.'} gainAmount={'50'} backgroundColor={'#F2622E'} capyPointsDark={false} isCompleted={true}></MissionItem>
            <MissionItem text={'Meet at least 60% of established goals.'} gainAmount={'70'} backgroundColor={'#A8F25D'} capyPointsDark={true} isCompleted={false}></MissionItem>
          </div>

        </div>
      </div>
    </>
  );
}
