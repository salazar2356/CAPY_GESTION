import './DebitCard.css';

interface DebitCardProps {
  amount: string,
  cardNumber: string,
  backgroundColor: string,
  textColor: string
  logo: string
}

export const DebitCard = ({ amount, cardNumber, backgroundColor, textColor, logo }: DebitCardProps) => {
  return (
    <div className='cardContainer' style={{ backgroundColor: backgroundColor }}>
      <div className='top-row'>
        <h2 className='amount' style={{ color: textColor }}>${amount}</h2>
        <img src={logo} alt="" />
      </div>
      <h2 className='subtitle' style={{ color: textColor }}>NUMBER</h2>
      <h2 className='cardNumber' style={{ color: textColor }}>{cardNumber} **** **** ****</h2>
    </div>
  );
}