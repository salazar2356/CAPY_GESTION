import "./InteractiveGrid.css";
import "gridstack/dist/gridstack.min.css";


import { GridStack } from "gridstack";
import { useEffect } from "react";

//Import components
import { TotalBalance } from "../TotalBalance/TotalBalance";
import { Income } from "../Income/Income";
import { CardsSpace } from "../CardsSpace/CardsSpace";
import { Expenses } from "../Expenses/Expenses";
import { ComparationGraphic } from "../ComparationGraphic/ComparationGraphic";
import { Savings } from "../Savings/Savings";
import { SaverLevel } from "../../RewardsPageComponents/SaverLevel/SaverLevel";
// import { Missions } from "../Missions/Missions";
import { Missions } from "../../RewardsPageComponents/Missions/Missions";
import { Capy } from "../Capy/Capy";

export const InteractiveGrid = () => {
  useEffect(() => {
    GridStack.init();
  });

  return <>
    <div id="gridContainer" className="grid-stack">
      <div className="grid-stack-item" gs-h="2" gs-w="4">
        <div className="grid-item-content">
          <TotalBalance></TotalBalance>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="1" gs-w="3">
        <div className="grid-item-content">
          <Income></Income>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="2" gs-w="2">
        <div className="grid-item-content">
          <Capy></Capy>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="8" gs-w="3">
        {/* <div className="grid-item-content"> */}
          <CardsSpace></CardsSpace>
        {/* </div> */}
      </div>
      <div className="grid-stack-item" gs-h="1" gs-w="3">
        <div className="grid-item-content">
          <Expenses></Expenses>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="3" gs-w="6">
        <div className="grid-item-content">
          <ComparationGraphic></ComparationGraphic>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="3" gs-w="3">
        <div className="grid-item-content">
          <Savings></Savings>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="3" gs-w="5">
        <div className="grid-item-content">
          <SaverLevel></SaverLevel>
        </div>
      </div>
      <div className="grid-stack-item" gs-h="3" gs-w="4">
        <div className="grid-item-content">
          <Missions></Missions>
        </div>
      </div>
    </div>
  </>
}
