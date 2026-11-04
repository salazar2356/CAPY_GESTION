import './profileHeader.css';
import backgroundHeader from "../../../assets/desktop/svg/backgroundHeader.svg"


export const ProfileHeader = () => {
    return (
        <div className="profileHeader">
            <div className='backgorundHeader'></div>
            <div className='userPicture'></div>
            <img src={backgroundHeader} alt="backgroundHeader" className="backgroundHeader" />

            
        </div>
    );
};
