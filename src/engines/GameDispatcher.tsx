"use client";

import TurnBasedEngine from "./TurnBasedEngine";
import HotPotatoEngine from "./HotPotatoEngine";
import McqEngine from "./McqEngine";
import TabooEngine from "./TabooEngine";
import ImposterEngine from "./ImposterEngine";

export default function GameDispatcher({ config }: { config: any }) {
  if (config.engineTemplate === "hot-potato") {
    return <HotPotatoEngine config={config} />;
  }
  if (config.engineTemplate === "mcq") {
    return <McqEngine config={config} />;
  }
  if (config.engineTemplate === "taboo") {
    return <TabooEngine config={config} />;
  }
  if (config.engineTemplate === "imposter") {
    return <ImposterEngine config={config} />;
  }
  return <TurnBasedEngine config={config} />;
}
