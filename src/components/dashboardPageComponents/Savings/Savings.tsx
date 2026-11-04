import './savings.css';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import MoveButton from '../../../assets/desktop/svg/MoveButton.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const Savings = () => {
  const totalIncome = useSelector((state: RootState) => state.userData.totalIncome)
  const savingsData = useSelector((state: RootState) => state.savings)

  let totalSavings = 0

  savingsData.savingsData.forEach((saving) => {
    totalSavings += saving.savingActualFee
  });

  const savingsPercentage = (totalSavings / totalIncome) * 100
  const incomePercentage = 100 - savingsPercentage

  return (
    <>
      <div className='savings'>
        <h3>Savings</h3>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <div className="progress-wrapper">
          <CircularProgressbar
            value={savingsPercentage}
            text={`$${totalSavings}`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: 'butt',
              pathTransitionDuration: 0.5,
              pathColor: ' #2D18BF',
              textColor: '#fff',
              trailColor: '#A8F25D',
              textSize: '14px',
            })}
            strokeWidth={15}
          />
        </div>

        <div id='savingsCircularProgressHints'>
          <div className='hintContainer'>
            <div className='colorHint' style={{ backgroundColor: '#2D18BF' }}></div>
            <p>Income</p>
            <p>{incomePercentage.toFixed(2)}%</p>
          </div>

          <div className='hintContainer'>
            <div className='colorHint' style={{ backgroundColor: '#A8F25D' }}></div>
            <p>Savings</p>
            <p>{savingsPercentage.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </>
  );
}


