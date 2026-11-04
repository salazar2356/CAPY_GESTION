import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import SummaryCard from "../SummaryCard/SummaryCard";

import trofeo from '../../../assets/desktop/svg/Trofeo.svg'
import bandera from '../../../assets/desktop/svg/Bandera.svg'
import Logo from '../../../assets/desktop/svg/Logo.svg'

const Summary: React.FC = () => {
  const { goalsCompleted, accumulatedCapypoints } = useSelector((state: RootState) => state.rewards.summary);

  const { saverLevels } = useSelector((state: RootState) => state.rewards);

  let currentLevelIndex = 0;
  for (let i = 0; i < saverLevels.length; i++) {
    if (accumulatedCapypoints < saverLevels[i].expNecesary) {
      currentLevelIndex = i - 1;
      break;
    }
  }

  if (currentLevelIndex < 0) currentLevelIndex = 0;

  const currentLevel = saverLevels[currentLevelIndex];

  return (
    <div className="Summary">
      <h2 id="summary">Summary</h2>
      <SummaryCard icon={trofeo} title="Saver level" content={currentLevel.name} backgroundColor="#F2622E" textDark={false} />
      <SummaryCard icon={bandera} title="Goals completed" content={goalsCompleted} backgroundColor="#A8F25D" textDark={true} />
      <SummaryCard icon={Logo} title="Capypoints" content={accumulatedCapypoints} backgroundColor="#3c4cff" textDark={false} />
    </div>
  );
};

export default Summary;