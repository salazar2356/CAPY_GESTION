import "./CustomerOpinion.css";

import star from '../../../assets/desktop/svg/icons/whiteStar.svg'

interface CustomerOpinionProps {
  quotesSolid: string;
  quotesOpacity: string;
  userOpinion: string;
  userImage: string;
  date: string;
}

export const CustomerOpinion = ({
  quotesOpacity,
  quotesSolid,
  userOpinion,
  userImage,
  date,
}: CustomerOpinionProps) => {
  return (
    <>
      <div className="CustomerOpinionContainer">
        <img src={quotesSolid} alt="" className="quotes" />
        <h3>{userOpinion}</h3>
        <div className="quotesOpacity-container">
          <img src={quotesOpacity} alt="" className="quotesOpacity" />
        </div>

        <div className="userData">
          <div className="userProfile">
            <img src={userImage} alt="" />
            <div className="Image">
              <p>Gabriel Cooper</p>
              <div className="Starts">
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
              </div>
            </div>
          </div>

          <p>{date}</p>
        </div>
      </div>
    </>
  );
};
