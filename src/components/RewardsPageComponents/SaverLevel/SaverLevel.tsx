// SaverLevel.tsx
import './SaverLevel.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { SaverLevelTitleDisplay } from '../SaverLevelTitleDisplay/SaverLevelTitleDisplay';
import { SaverLevelProgressBar } from '../SaverLevelProgressBar/SaverLevelProgressBar';

export const SaverLevel = () => {
  const accumulatedExp = useSelector((state: RootState) => state.rewards.userExpGained);
  const { saverLevels } = useSelector((state: RootState) => state.rewards);

  let currentLevelIndex = 0;
  for (let i = 0; i < saverLevels.length; i++) {
    if (accumulatedExp < saverLevels[i].expNecesary) {
      currentLevelIndex = i - 1;
      break;
    }
  }

  if (currentLevelIndex < 0) currentLevelIndex = 0;

  const currentLevel = saverLevels[currentLevelIndex];
  const nextLevel = saverLevels[currentLevelIndex + 1];

  const experienceInCurrentLevel = accumulatedExp - currentLevel.expNecesary;
  const experienceToNextLevel = nextLevel.expNecesary - currentLevel.expNecesary;
  const progressPercentage = (experienceInCurrentLevel / experienceToNextLevel) * 100;

  return (
    <div className='SaverLevelContainer'>
      <h2>Saver level</h2>
      <SaverLevelTitleDisplay levelTitle={currentLevel.name} />
      <SaverLevelProgressBar progressValue={progressPercentage < 0 ? 0 : progressPercentage} />
    </div>
  );
};
