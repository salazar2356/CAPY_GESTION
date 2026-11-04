import "./LandingPage.css";
import "./LandingPage.css";

//Import components

import { NavLanding } from '../../components/landingPageComponents/NavLanding/NavLanding'
import { LandingFirstSectionButtons } from '../../components/landingPageComponents/LandingFirstSectionButtons/LandingFirstSectionButtons'
import { UniqueFeatureCard } from '../../components/landingPageComponents/uniqueFeatureCard/uniqueFeatureCard'
import { CustomerOpinion } from '../../components/landingPageComponents/CustomerOpinion/CustomerOpinion'

//Import images
import arrowDownWhite from '../../assets/desktop/svg/arrowDownWhite.svg'
import landingSecondSectionMockups from '../../assets/desktop/png/mockupsCapyPc.jpg'

import logoBancolombia from '../../assets/desktop/svg/logo/logoBancolombia.svg'
import logoNequi from '../../assets/desktop/svg/logo/logoNequi.svg'
import logoVisa from '../../assets/desktop/svg/logo/logoVisa.svg'
import logoBBVA from '../../assets/desktop/svg/logo/logoBBVA.svg'
import logoFalabella from '../../assets/desktop/svg/logo/logoFalabella.svg'
import logoNu from '../../assets/desktop/svg/logo/logoNu.svg'

import backgroundFeature1 from '../../assets/desktop/png/features1.png'
import backgroundFeature2 from '../../assets/desktop/png/features2.png'
import backgroundFeature3 from '../../assets/desktop/png/features3.png'
import backgroundFeature4 from '../../assets/desktop/png/features4.png'

import quotesGreen from '../../assets/desktop/svg/icons/quotesGreen.svg'
import quotesGreenOpacity from '../../assets/desktop/svg/icons/quotesGreenOpacity.svg'
import quotesBlue from '../../assets/desktop/svg/icons/quotesBlue.svg'
import quotesBlueOpacity from '../../assets/desktop/svg/icons/quotesBlueOpacity.svg'
import quotesOrange from '../../assets/desktop/svg/icons/quotesOrange.svg'
import quotesOrangeOpacity from '../../assets/desktop/svg/icons/quotesOrangeOpacity.svg'

import gabrielCooper from '../../assets/desktop/png/gabrielCooper.png'
import edawrdSans from '../../assets/desktop/png/edwardSans.png'
import nathalyMoon from '../../assets/desktop/png/nathalyMoon.png'


export const LandingPage = () => {
  return (
    <>
      <main className="page" id="landingPageContainer">
        <section id="firstSection">
          <NavLanding></NavLanding>
          <h1>Take Control of Your Finances with Capy</h1>
          <p>
            Capy makes managing your money fun and simple! Personalize your
            dashboard, track expenses, and get real-time insights—all with the
            help of your interactive assistant. Start building healthy financial
            habits today!
          </p>
          <LandingFirstSectionButtons></LandingFirstSectionButtons>
          <img src={arrowDownWhite} alt="" id="arrowDownWhite" />
        </section>

        <section id="secondSection">
          <img src={landingSecondSectionMockups} alt="" />
        </section>

        <section id="thirdSection">
          <h2>Endless connections</h2>
          <div className="wrapper">
            <div className="itemLeft item1" id="bancolombia">
              <img src={logoBancolombia} alt="" className="itemRightImg" />
            </div>
            <div className="itemLeft item2">
              <img src={logoNequi} alt="" />
            </div>
            <div className="itemLeft item3">
              <img src={logoVisa} alt="" />
            </div>
            <div className="itemLeft item4">
              <img src={logoBBVA} alt="" />
            </div>
            <div className="itemLeft item5">
              <img src={logoFalabella} alt="" />
            </div>
            <div className="itemLeft item6">
              <img src={logoNu} alt="" />
            </div>
            <div className="itemLeft item7">
              <img src={logoVisa} alt="" />
            </div>
          </div>
          <div className="wrapper">
            <div className="itemRight item1" id="bancolombia">
              <img src={logoBancolombia} alt="" className="itemRightImg" />
            </div>
            <div className="itemRight item2">
              <img src={logoNequi} alt="" />
            </div>
            <div className="itemRight item3">
              <img src={logoVisa} alt="" />
            </div>
            <div className="itemRight item4">
              <img src={logoBBVA} alt="" />
            </div>
            <div className="itemRight item5">
              <img src={logoFalabella} alt="" />
            </div>
            <div className="itemRight item6">
              <img src={logoNu} alt="" />
            </div>
            <div className="itemRight item7">
              <img src={logoVisa} alt="" />
            </div>
          </div>
          <div className="wrapper">
            <div className="itemLeft item1" id="bancolombia">
              <img src={logoBancolombia} alt="" className="itemRightImg" />
            </div>
            <div className="itemLeft item2">
              <img src={logoNequi} alt="" />
            </div>
            <div className="itemLeft item3">
              <img src={logoVisa} alt="" />
            </div>
            <div className="itemLeft item4">
              <img src={logoBBVA} alt="" />
            </div>
            <div className="itemLeft item5">
              <img src={logoFalabella} alt="" />
            </div>
            <div className="itemLeft item6">
              <img src={logoNu} alt="" />
            </div>
            <div className="itemLeft item7">
              <img src={logoVisa} alt="" />
            </div>
          </div>
        </section>

        <section id="fourthSection">
          <h2>Unique features</h2>
          <p id="subTitle">
            Discover a range of innovative tools designed to simplify financial
            planning. From personalized dashboards to interactive
            visualizations, our app helps you manage your finances effortlessly
            and effectively.
          </p>
          <div className="featuresRow">
            <UniqueFeatureCard
              text={
                "Capy, your friendly finance assistant, helps you navigate the app with tips, guidance, and insights to improve your financial planning and decision-making."
              }
              title={"Interactive mascot"}
              textColor={"#FFFFFF"}
              backgroundImage={backgroundFeature1}
            ></UniqueFeatureCard>

            <UniqueFeatureCard
              text={
                "Dynamic charts and graphs throughout the app provide clear, real-time insights, making it easier to understand and manage your finances effectively."
              }
              title={"Interactive data visualization"}
              textColor={"#FFFFFF"}
              backgroundImage={backgroundFeature2}
            ></UniqueFeatureCard>
          </div>

          <div className="featuresRow">
            <UniqueFeatureCard
              text={
                "An interactive dashboard grid lets you customize your financial data display, tailoring the experience to suit your personal preferences and needs."
              }
              title={"Experience personalization"}
              textColor={"#21147A"}
              backgroundImage={backgroundFeature3}
            ></UniqueFeatureCard>

            <UniqueFeatureCard
              text={
                "Easily track and plan your income and expenses, helping you stay on top of your finances and reach your financial goals."
              }
              title={"Income and expense planner"}
              textColor={"#21147A"}
              backgroundImage={backgroundFeature4}
            ></UniqueFeatureCard>
          </div>
        </section>

        <section id="fifthSection">
          <h2>What Our Customers Say</h2>
          <p id="subTitle">
            See how Capy has empowered users to take control of their finances.
            From personalized planning to interactive tools, hear from people
            who are mastering their money with ease!
          </p>

          <div id="customersOpinionCardsContainer">
            <CustomerOpinion
              quotesSolid={quotesGreen}
              quotesOpacity={quotesGreenOpacity}
              userOpinion={
                "I definitely love how Capy helped me achieve my financial goals."
              }
              userImage={gabrielCooper}
              date={"1 Month ago"}
            ></CustomerOpinion>
            <CustomerOpinion
              quotesSolid={quotesBlue}
              quotesOpacity={quotesBlueOpacity}
              userOpinion={
                "The interactive tools make finances easy to understand!"
              }
              userImage={edawrdSans}
              date={"1 Week ago"}
            ></CustomerOpinion>
            <CustomerOpinion
              quotesSolid={quotesOrange}
              quotesOpacity={quotesOrangeOpacity}
              userOpinion={
                "Capy made managing my money so much easier and fun!"
              }
              userImage={nathalyMoon}
              date={"2 Weeks ago"}
            ></CustomerOpinion>
          </div>
        </section>

        <div id='backgroundLandingPage' className="backgroundPage">

        </div>
      </main >
    </>
  );
};
