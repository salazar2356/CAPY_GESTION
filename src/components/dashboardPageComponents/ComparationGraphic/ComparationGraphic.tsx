import './comparationGraphic.css';

import { useState } from 'react';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import IE from '../../../assets/desktop/svg/I&E.svg'

//Import components
import { ComparationBarGraph, ComparationPeriod } from '../ComparationBarGraph/ComparationBarGraph';

export const ComparationGraphic = () => {
  const [period, setPeriod] = useState<ComparationPeriod>('daily');

  return (
    <>
      <div className='comparation'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <p>This is how you manage your money</p>
        <div className='select-container'>
          <select value={period} onChange={(e) => setPeriod(e.target.value as ComparationPeriod)} aria-label="Period">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <img className="I&E" src={IE} alt="Expenses and incomes" />
        </div>
        <ComparationBarGraph period={period}></ComparationBarGraph>
      </div>
    </>
  );
}
