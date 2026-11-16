import './comparationGraphic.css';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import IE from '../../../assets/desktop/svg/I&E.svg'

//Import components

import { ComparationBarGraph } from '../ComparationBarGraph/ComparationBarGraph';

export const ComparationGraphic = () => {
  return (
    <>

      <div className='comparation'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <p>This is how you manage your money</p>
        <div className='select-container'>
          <span>Last 7 days</span>
          <img className="income-expense-legend" src={IE} alt="MoveButton" />
        </div>
        <ComparationBarGraph></ComparationBarGraph>
      </div>
    </>
  );
}
