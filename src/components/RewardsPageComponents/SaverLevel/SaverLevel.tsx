// SaverLevel.tsx (HU45: nivel según la experiencia, HU44: racha)
import './SaverLevel.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { SaverLevelTitleDisplay } from '../SaverLevelTitleDisplay/SaverLevelTitleDisplay';
import { SaverLevelProgressBar } from '../SaverLevelProgressBar/SaverLevelProgressBar';
import { getSaverLevelInfo } from '../../../utils/saverLevels';
import { useActiveStreak } from '../PointsHistory/PointsHistory';

export const SaverLevel = () => {
  const accumulatedExp = useSelector((state: RootState) => state.rewards.userExpGained);
  const levelInfo = getSaverLevelInfo(accumulatedExp || 0);
  const streak = useActiveStreak();

  return (
    <div className='SaverLevelContainer'>
      <h2>Saver level</h2>
      <SaverLevelTitleDisplay levelTitle={levelInfo.levelName} />
      <SaverLevelProgressBar progressValue={levelInfo.progress} />
      <p style={{ margin: '8px 0 0 0', fontFamily: '"Space Grotesk"', fontSize: '14px', textAlign: 'center' }}>
        {levelInfo.isMax ? 'Max level reached!' : `${levelInfo.expToNextLevel} XP to next level`} · 🔥 {streak.current} {streak.current === 1 ? 'day' : 'days'}
      </p>
    </div>
  );
};
