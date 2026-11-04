import './SaverLevel.css';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'

//Import components
import { SaverLevelTitleDisplay } from '../SaverLevelTitleDisplay/SaverLevelTitleDisplay';
import { SaverLevelProgressBar } from '../SaverLevelProgressBar/SaverLevelProgressBar';

export const SaverLevel = () => {
  return (
    <>
      <div className='SaverLevelContainer'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />
        <p>Level of saver</p>
        <SaverLevelTitleDisplay></SaverLevelTitleDisplay>
        <SaverLevelProgressBar></SaverLevelProgressBar>
      </div>
    </>
  );
}

