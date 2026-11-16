import './SaverLevelTitleDisplay.css';

import bronzeMedal from '../../../assets/desktop/png/bronzeMedal.png'
import silverMedal from '../../../assets/desktop/png/silverMedal.png'
import goldMedal from '../../../assets/desktop/png/goldMedal.png'
import diamondMedal from '../../../assets/desktop/png/diamondMedal.png'
import lunarMedal from '../../../assets/desktop/png/lunarMedal.png'
import maxMedal from '../../../assets/desktop/png/maxMedal.png'
import { saverLevelsNames } from '../../../store/rewards/types';

interface SaverLevelTitleDisplayProps {
  levelTitle: string | saverLevelsNames;
}

export const SaverLevelTitleDisplay = ({ levelTitle }: SaverLevelTitleDisplayProps) => {

  if (levelTitle === saverLevelsNames.level1 || levelTitle === saverLevelsNames.level2) {
    return (
      <div id="SaverLevelTitleDisplayContainer">
        <h3>{levelTitle}</h3>
        <img src={bronzeMedal} alt={`Nivel ${levelTitle} del ahorrador`} loading="eager" />
      </div>
    );
  } else if (levelTitle === saverLevelsNames.level3 || levelTitle === saverLevelsNames.level4 || levelTitle === saverLevelsNames.level5) {
    return (
      <div id="SaverLevelTitleDisplayContainer">
        <h3>{levelTitle}</h3>
        <img src={silverMedal} alt={`Nivel ${levelTitle} del ahorrador`} loading="eager" />
      </div>
    );
  } else if (levelTitle === saverLevelsNames.level6 || levelTitle === saverLevelsNames.level7) {
    return (
      <div id="SaverLevelTitleDisplayContainer">
        <h3>{levelTitle}</h3>
        <img src={goldMedal} alt={`Nivel ${levelTitle} del ahorrador`} loading="eager" />
      </div>
    );
  } else if (levelTitle === saverLevelsNames.level8) {
    return (
      <div id="SaverLevelTitleDisplayContainer">
        <h3>{levelTitle}</h3>
        <img src={diamondMedal} alt={`Nivel ${levelTitle} del ahorrador`} loading="eager" />
      </div>
    );
  } else if (levelTitle === saverLevelsNames.level9) {
    return (
      <div id="SaverLevelTitleDisplayContainer">
        <h3>{levelTitle}</h3>
        <img src={lunarMedal} alt={`Nivel ${levelTitle} del ahorrador`} loading="eager" />
      </div>
    );
  } else if (levelTitle === saverLevelsNames.level10) {
    return (
      <div id="SaverLevelTitleDisplayContainer">
        <h3>{levelTitle}</h3>
        <img src={maxMedal} alt={`Nivel ${levelTitle} del ahorrador`} loading="eager" />
      </div>
    );
  }


};

