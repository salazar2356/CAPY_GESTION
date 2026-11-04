import './CardsSpace.css';
import AddCard from "../AddCard/AddCard";
import { DebitCard } from '../DebitCard/DebitCard';

//Import Hooks
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { cardNamesEnum } from '../../../store/userData/types';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import logoNu from '../../../assets/desktop/svg/logo/logoNuWhite.svg'
import logoVisa from '../../../assets/desktop/svg/logo/logoVisaWhite.svg'
import logoFalabella from '../../../assets/desktop/svg/logo/logoFalabellaWhite.svg'
import logoNequi from '../../../assets/desktop/svg/logo/logoNequiPurple.svg'

export const CardsSpace = () => {
  const cardsData = useSelector((state: RootState) => state.userData.cards)

  return (
    <>
      <div className='cardSpace'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />
        <h2>Your cards</h2>
        <AddCard />
        {cardsData.map(((card) => {
          switch (card.cardName) {
            case cardNamesEnum.nequi:
              return <DebitCard key={card.cardNumber} amount={card.cardMoney.toString()} cardNumber={card.cardNumber.toString()} backgroundColor={'#F9F9F9'} logo={logoNequi} textColor={'#391881'} />
            case cardNamesEnum.falabella:
              return <DebitCard key={card.cardNumber} amount={card.cardMoney.toString()} cardNumber={card.cardNumber.toString()} backgroundColor={'#A8F25D'} logo={logoFalabella} textColor={'#391881'} />
            case cardNamesEnum.nu:
              return <DebitCard key={card.cardNumber} amount={card.cardMoney.toString()} cardNumber={card.cardNumber.toString()} backgroundColor={'#2D18BF'} logo={logoNu} textColor={'#F9F9F9'} />
            case cardNamesEnum.visa:
              return <DebitCard key={card.cardNumber} amount={card.cardMoney.toString()} cardNumber={card.cardNumber.toString()} backgroundColor={'#F2622E'} logo={logoVisa} textColor={'#F9F9F9'} />
            default:
              break;
          }
        }))}
      </div>
    </>
  );
}

