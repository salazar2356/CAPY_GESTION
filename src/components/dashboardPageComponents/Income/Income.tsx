import './Income.css';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const Income = () => {

  const totalIncome = useSelector((state: RootState) => state.userData.totalIncome)

  return (
    <>

      <div className='income'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <h2>Total Income</h2>
        <h1>${totalIncome}</h1>
      </div>


    </>
  );
}

