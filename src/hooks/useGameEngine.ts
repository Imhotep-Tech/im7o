import { useState, useEffect } from "react";
import { Entity, shuffleArray, GameConfig } from "../utils/gameUtils";

export function useGameEngine(config: GameConfig) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [setupPhase, setSetupPhase] = useState(true);
  const [entities, setEntities] = useState<Entity[]>(() => {
    if (config.mode === "two-team") {
      return [
        { id: "t1", name: "الفريق الأول", score: 0, isEliminated: false },
        { id: "t2", name: "الفريق الثاني", score: 0, isEliminated: false }
      ];
    } else {
      return [
        { id: "e1", name: config.mode === "individual" ? "اللاعب 1" : "الفريق 1", score: 0, isEliminated: false },
        { id: "e2", name: config.mode === "individual" ? "اللاعب 2" : "الفريق 2", score: 0, isEliminated: false }
      ];
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deck, setDeck] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeEntityIndex, setActiveEntityIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [customTimer, setCustomTimer] = useState(config.defaultTimerSeconds || 30);

  const turnStrategy = config.turnStrategy || "sequential";

  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const startGame = () => {
    if (entities.filter(e => e.name.trim() !== "").length < 2) return;
    setDeck(shuffleArray(config.cards));
    setCurrentCardIndex(0);
    setActiveEntityIndex(0);
    setSetupPhase(false);
  };

  const restartGame = () => {
    setEntities(entities.map(e => ({ ...e, score: 0, isEliminated: false })));
    setDeck(shuffleArray(config.cards));
    setCurrentCardIndex(0);
    setActiveEntityIndex(0);
  };

  const handleScore = (points: number) => {
    const updatedEntities = [...entities];
    const active = updatedEntities[activeEntityIndex];
    active.score += points;
    setEntities(updatedEntities);
    nextTurn(updatedEntities);
  };

  const handleOpenScore = (entityIdx: number) => {
    const updatedEntities = [...entities];
    updatedEntities[entityIdx].score += 1;
    setEntities(updatedEntities);
    setCurrentCardIndex(prev => prev + 1);
  };

  const skipCard = () => {
    if (turnStrategy === "open") {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      nextTurn(entities);
    }
  };

  const passTurn = () => {
    const currentEntities = [...entities];
    let nextIndex = (activeEntityIndex + 1) % currentEntities.length;
    let loopCount = 0;
    while (currentEntities[nextIndex].isEliminated && loopCount < currentEntities.length) {
      nextIndex = (nextIndex + 1) % currentEntities.length;
      loopCount++;
    }
    setActiveEntityIndex(nextIndex);
  };

  const eliminateActive = () => {
    const updatedEntities = [...entities];
    updatedEntities[activeEntityIndex].isEliminated = true;
    setEntities(updatedEntities);
    nextTurn(updatedEntities);
  };

  const nextTurn = (currentEntities: Entity[]) => {
    let nextIndex = (activeEntityIndex + 1) % currentEntities.length;
    let loopCount = 0;
    while (currentEntities[nextIndex].isEliminated && loopCount < currentEntities.length) {
      nextIndex = (nextIndex + 1) % currentEntities.length;
      loopCount++;
    }
    setActiveEntityIndex(nextIndex);
    setCurrentCardIndex(prev => prev + 1);
  };

  const activeTeamsCount = entities.filter(e => !e.isEliminated).length;
  const isGameOver = currentCardIndex >= deck.length || activeTeamsCount <= 1;
  const activeEntity = entities[activeEntityIndex];

  return {
    showOverlay,
    setupPhase,
    entities,
    setEntities,
    deck,
    currentCardIndex,
    activeEntityIndex,
    activeEntity,
    showInstructions,
    setShowInstructions,
    customTimer,
    setCustomTimer,
    turnStrategy,
    startGame,
    restartGame,
    handleScore,
    handleOpenScore,
    skipCard,
    passTurn,
    eliminateActive,
    nextTurn,
    isGameOver,
    activeTeamsCount
  };
}
