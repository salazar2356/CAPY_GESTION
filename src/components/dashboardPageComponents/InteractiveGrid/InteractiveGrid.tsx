import "./InteractiveGrid.css";
import "gridstack/dist/gridstack.min.css";


import { GridStack } from "gridstack";
import { useEffect, useRef, useState } from "react";

//Import components
import { TotalBalance } from "../TotalBalance/TotalBalance";
import { Income } from "../Income/Income";
import { CardsSpace } from "../CardsSpace/CardsSpace";
import { Expenses } from "../Expenses/Expenses";
import { ComparationGraphic } from "../ComparationGraphic/ComparationGraphic";
import { Savings } from "../Savings/Savings";
import { SaverLevel } from "../../RewardsPageComponents/SaverLevel/SaverLevel";
import { Missions } from "../../RewardsPageComponents/Missions/Missions";
import { Capy } from "../Capy/Capy";
import { RecentMovements } from "../RecentMovements/RecentMovements";

// Hasta este ancho las tarjetas se muestran una debajo de otra (celular y tablet angosta)
const COMPACT_MAX_WIDTH = 900;

const isCompactScreen = () => typeof window !== 'undefined' && window.innerWidth <= COMPACT_MAX_WIDTH;

export const InteractiveGrid = () => {
  const [compact, setCompact] = useState(isCompactScreen);
  const gridRef = useRef<GridStack | null>(null);

  // Cambia de diseño si la pantalla cruza el límite (por ejemplo al girar el celular)
  useEffect(() => {
    const onResize = () => setCompact(isCompactScreen());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // El grid movible solo se activa en pantallas grandes, con casillas de alto fijo
  useEffect(() => {
    if (compact) return;
    gridRef.current = GridStack.init({ cellHeight: 100, margin: 6, float: false });
    return () => {
      gridRef.current?.destroy(false);
      gridRef.current = null;
    };
  }, [compact]);

  return <>
    <div id="gridContainer" key={compact ? 'compact' : 'grid'} className={compact ? 'dashboardStack' : 'grid-stack'}>
      <div className="grid-stack-item widgetBalance" gs-h="2" gs-w="4">
        <div className="grid-item-content">
          <TotalBalance></TotalBalance>
        </div>
      </div>
      <div className="grid-stack-item widgetSmall" gs-h="1" gs-w="3">
        <div className="grid-item-content">
          <Income></Income>
        </div>
      </div>
      <div className="grid-stack-item widgetCapy" gs-h="2" gs-w="2">
        <div className="grid-item-content">
          <Capy></Capy>
        </div>
      </div>
      <div className="grid-stack-item widgetCards" gs-h="8" gs-w="3">
        <CardsSpace></CardsSpace>
      </div>
      <div className="grid-stack-item widgetSmall" gs-h="1" gs-w="3">
        <div className="grid-item-content">
          <Expenses></Expenses>
        </div>
      </div>
      <div className="grid-stack-item widgetChart" gs-h="3" gs-w="6">
        <div className="grid-item-content">
          <ComparationGraphic></ComparationGraphic>
        </div>
      </div>
      <div className="grid-stack-item widgetChart widgetAuto" gs-h="3" gs-w="3">
        <div className="grid-item-content">
          <Savings></Savings>
        </div>
      </div>
      <div className="grid-stack-item widgetTall widgetSaver" gs-h="4" gs-w="5">
        <div className="grid-item-content">
          <SaverLevel></SaverLevel>
        </div>
      </div>
      <div className="grid-stack-item widgetTall" gs-h="4" gs-w="4">
        <div className="grid-item-content">
          <Missions></Missions>
        </div>
      </div>
      {/* HU17: últimos movimientos */}
      <div className="grid-stack-item widgetList" gs-h="4" gs-w="6">
        <div className="grid-item-content">
          <RecentMovements></RecentMovements>
        </div>
      </div>
    </div>
  </>
}
