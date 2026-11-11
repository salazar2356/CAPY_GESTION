import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import SummaryCard from "../SummaryCard/SummaryCard";
import { getSaverLevelInfo } from "../../../utils/saverLevels";

import trofeo from '../../../assets/desktop/svg/Trofeo.svg'
import bandera from '../../../assets/desktop/svg/Bandera.svg'
import Logo from '../../../assets/desktop/svg/Logo.svg'

const Summary: React.FC = () => {
  const { goalsCompleted, accumulatedCapypoints } = useSelector((state: RootState) => state.rewards.summary);
  const userExpGained = useSelector((state: RootState) => state.rewards.userExpGained);

  // HU45: el nivel depende de la experiencia ganada
  const currentLevel = getSaverLevelInfo(userExpGained || 0);

  return (
    <div className="Summary">
      <h2 id="summary">Summary</h2>
      <SummaryCard icon={trofeo} title="Saver level" content={currentLevel.levelName} backgroundColor="#F2622E" textDark={false} />
      <SummaryCard icon={bandera} title="Goals completed" content={goalsCompleted} backgroundColor="#A8F25D" textDark={true} />
      <SummaryCard icon={Logo} title="Capypoints" content={accumulatedCapypoints} backgroundColor="#3c4cff" textDark={false} />
    </div>
  );
};

export default Summary;
