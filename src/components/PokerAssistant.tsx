import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Target, DollarSign, BarChart3, X } from 'lucide-react';

interface Card {
  rank: string;
  suit: string;
  value: number;
}

interface Draw {
  type: string;
  outs: number;
  probability: number;
}

interface Results {
  outs: number;
  draws: Draw[];
  winProbability: string;
  potOdds: string;
  impliedOdds: string;
  expectedValue: number;
  shouldCall: boolean;
  foldEquity: number;
  handStrength: {
    type: string;
    strength: number;
  };
}

interface CardDisplayProps {
  card: string;
  onClick: () => void;
  onClear: () => void;
  placeholder: string;
  small?: boolean;
}

interface DrawPotential {
  flushDraw: boolean;
  straightDraw: boolean;
  straightFlushDraw: boolean;
  gutshot: boolean;
  doubleGutshot: boolean;
  backDoorFlush: boolean;
  backDoorStraight: boolean;
  overCards: number;
  drawStrength: number;
}

interface HandAnalysis {
  type: string;
  strength: number;
  drawPotential?: DrawPotential;
  outs?: number;
  draws?: Draw[];
}

const PokerAssistant: React.FC = () => {
  const [playerCards, setPlayerCards] = useState<string[]>(['', '']);
  const [communityCards, setCommunityCards] = useState<string[]>(['', '', '', '', '']);
  const [potSize, setPotSize] = useState<number | ''>('');
  const [betToCall, setBetToCall] = useState<number | ''>('');
  const [opponents, setOpponents] = useState<number>(1);
  const [position, setPosition] = useState<'early' | 'middle' | 'late'>('middle');
  const [results, setResults] = useState<Results | null>(null);
  const [handStrength, setHandStrength] = useState<{ type: string; strength: number } | null>(null);
  const [showCardSelector, setShowCardSelector] = useState<boolean>(false);
  const [selectingFor, setSelectingFor] = useState<{ type: string; index: number }>({ type: '', index: 0 });
  const [usedCards, setUsedCards] = useState<Set<string>>(new Set());

  const suits = [
    { symbol: '♠', name: 'S', color: 'text-gray-900', bg: 'bg-white' },
    { symbol: '♥', name: 'H', color: 'text-red-500', bg: 'bg-white' },
    { symbol: '♦', name: 'D', color: 'text-red-500', bg: 'bg-white' },
    { symbol: '♣', name: 'C', color: 'text-gray-900', bg: 'bg-white' }
  ];
  
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  const rankValues: { [key: string]: number } = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
                      '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

  useEffect(() => {
    const allCards = [...playerCards, ...communityCards].filter(card => card);
    setUsedCards(new Set(allCards));
  }, [playerCards, communityCards]);

  const parseCard = (cardStr: string): Card | null => {
    if (!cardStr || cardStr.length < 2) return null;
    const rank = cardStr.slice(0, -1);
    const suit = cardStr.slice(-1);
    return { rank, suit, value: rankValues[rank] };
  };

  const openCardSelector = (type: string, index: number): void => {
    setSelectingFor({ type, index });
    setShowCardSelector(true);
  };

  const selectCard = (rank: string, suitName: string): void => {
    const cardString = rank + suitName;
    
    if (usedCards.has(cardString)) return;
    
    if (selectingFor.type === 'player') {
      const newCards = [...playerCards];
      if (newCards[selectingFor.index]) {
        const newUsed = new Set(usedCards);
        newUsed.delete(newCards[selectingFor.index]);
        setUsedCards(newUsed);
      }
      newCards[selectingFor.index] = cardString;
      setPlayerCards(newCards);
    } else {
      const newCards = [...communityCards];
      if (newCards[selectingFor.index]) {
        const newUsed = new Set(usedCards);
        newUsed.delete(newCards[selectingFor.index]);
        setUsedCards(newUsed);
      }
      newCards[selectingFor.index] = cardString;
      setCommunityCards(newCards);
    }
    
    setShowCardSelector(false);
  };

  const clearCard = (type: string, index: number): void => {
    if (type === 'player') {
      const newCards = [...playerCards];
      newCards[index] = '';
      setPlayerCards(newCards);
    } else {
      const newCards = [...communityCards];
      newCards[index] = '';
      setCommunityCards(newCards);
    }
  };

  const CardDisplay: React.FC<CardDisplayProps> = ({ card, onClick, onClear, placeholder, small = false }) => {
    const parsed = parseCard(card);
    const sizeClass = small ? 'w-12 h-16 text-xs' : 'w-16 h-20 text-sm';
    
    if (!card) {
      return (
        <button
          onClick={onClick}
          className={`${sizeClass} border-2 border-dashed border-gray-500 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center text-gray-400`}
        >
          {placeholder}
        </button>
      );
    }

    const suit = suits.find(s => s.name === parsed?.suit);
    
    return (
      <div className={`${sizeClass} bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center relative group cursor-pointer`}
           onClick={onClick}>
        <div className={`font-bold ${small ? 'text-lg' : 'text-xl'} ${suit?.color || 'text-black'}`}>
          {parsed?.rank}
        </div>
        <div className={`${small ? 'text-lg' : 'text-2xl'} ${suit?.color || 'text-black'}`}>
          {suit?.symbol || parsed?.suit}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const CardSelector: React.FC = () => {
    if (!showCardSelector) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Selecionar Carta</h2>
            <button
              onClick={() => setShowCardSelector(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {suits.map((suit) => (
              <div key={suit.name} className="space-y-3">
                <h3 className={`text-center font-semibold text-xl ${suit.color === 'text-red-500' ? 'text-red-400' : 'text-white'}`}>
                  {suit.symbol}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {ranks.map((rank) => {
                    const cardString = rank + suit.name;
                    const isUsed = usedCards.has(cardString);
                    
                    return (
                      <button
                        key={rank}
                        onClick={() => !isUsed && selectCard(rank, suit.name)}
                        disabled={isUsed}
                        className={`w-full h-12 rounded-lg border-2 font-bold text-lg transition-all
                          ${isUsed 
                            ? 'bg-gray-600 border-gray-600 text-gray-500 cursor-not-allowed opacity-50' 
                            : `${suit.bg} ${suit.color} border-gray-300 hover:border-green-400 hover:shadow-lg cursor-pointer`
                          }`}
                      >
                        {rank}{suit.symbol}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const checkStraight = (values: number[]): boolean => {
    const unique = [...new Set(values)].sort((a, b) => b - a);
    for (let i = 0; i <= unique.length - 5; i++) {
      if (unique[i] - unique[i + 4] === 4) return true;
    }
    // Check for Ace-to-5 straight
    if (unique.includes(14) && unique.includes(2) && unique.includes(3) && unique.includes(4) && unique.includes(5)) {
      return true;
    }
    return false;
  };

  const getBestPossibleHand = (communityCards: string[]) => {
    const validCommunityCards = communityCards.filter(card => card);
    if (validCommunityCards.length === 0) return { type: 'Desconhecido', strength: 0 };

    const communityParsed = validCommunityCards.map(parseCard).filter(Boolean) as Card[];
    
    // Contagem de naipes e valores no board
    const suits: { [key: string]: number } = {};
    const ranks: { [key: string]: number } = {};
    const values = communityParsed.map(c => c.value).sort((a, b) => b - a);
    
    communityParsed.forEach(card => {
      suits[card.suit] = (suits[card.suit] || 0) + 1;
      ranks[card.rank] = (ranks[card.rank] || 0) + 1;
    });

    // Verifica as melhores mãos possíveis com as cartas da mesa
    const isFlushPossible = Object.values(suits).some(count => count >= 3);
    const isStraightPossible = checkStraightPossible(values);
    const maxOfAKind = Math.max(...Object.values(ranks));

    if (maxOfAKind === 4) return { type: 'Quadra', strength: 90 }; // Quadra na mesa
    if (maxOfAKind === 3 && Object.values(ranks).includes(2)) return { type: 'Full House', strength: 85 }; // Full house na mesa
    if (isFlushPossible) return { type: 'Flush Possível', strength: 80 };
    if (isStraightPossible) return { type: 'Sequência Possível', strength: 75 };
    if (maxOfAKind === 3) return { type: 'Trinca', strength: 65 };
    if (Object.values(ranks).filter(count => count === 2).length >= 2) return { type: 'Dois Pares', strength: 55 };
    if (maxOfAKind === 2) return { type: 'Um Par', strength: 45 };
    
    return { type: 'Carta Alta', strength: 30 };
  };

  const checkStraightPossible = (values: number[]): boolean => {
    if (values.length < 3) return false;
    const unique = [...new Set(values)].sort((a, b) => b - a);
    for (let i = 0; i < unique.length - 2; i++) {
      if (unique[i] - unique[i + 2] <= 4) return true;
    }
    return false;
  };

  const analyzeDrawPotential = (playerCards: Card[], communityCards: Card[]): DrawPotential => {
    const allCards = [...playerCards, ...communityCards];
    const suits: { [key: string]: Card[] } = {};
    const values = allCards.map(c => c.value).sort((a, b) => a - b);
    const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
    
    // Agrupa cartas por naipe
    allCards.forEach(card => {
      if (!suits[card.suit]) suits[card.suit] = [];
      suits[card.suit].push(card);
    });

    // Analisa possibilidades de flush
    let flushDraw = false;
    const backDoorFlush = Object.values(suits).some(cards => cards.length === 3);
    
    // Analisa possibilidades de sequência
    const straightDraws = analyzeStraightDraws(uniqueValues);
    const { straightDraw, gutshot, doubleGutshot, backDoorStraight } = straightDraws;

    // Analisa possibilidade de straight flush
    const straightFlushDraw = Object.entries(suits).some(([_, cards]) => {
      if (cards.length < 3) return false;
      const values = cards.map(c => c.value).sort((a, b) => a - b);
      return analyzeStraightDraws(values).straightDraw || analyzeStraightDraws(values).gutshot;
    });

    // Conta overcards (cartas maiores que as da mesa)
    const communityHighCard = Math.max(...communityCards.map(c => c.value), 0);
    const overCards = playerCards.filter(c => c.value > communityHighCard).length;

    // Calcula força total do draw
    let drawStrength = 0;
    if (flushDraw) drawStrength += 35;
    if (straightDraw) drawStrength += 30;
    if (straightFlushDraw) drawStrength += 40;
    if (gutshot) drawStrength += 15;
    if (doubleGutshot) drawStrength += 20;
    if (backDoorFlush) drawStrength += 10;
    if (backDoorStraight) drawStrength += 8;
    drawStrength += overCards * 5;

    return {
      flushDraw,
      straightDraw,
      straightFlushDraw,
      gutshot,
      doubleGutshot,
      backDoorFlush,
      backDoorStraight,
      overCards,
      drawStrength
    };
  };

  const analyzeStraightDraws = (values: number[]): { 
    straightDraw: boolean; 
    gutshot: boolean; 
    doubleGutshot: boolean;
    backDoorStraight: boolean;
  } => {
    let straightDraw = false;
    let gutshot = false;
    let doubleGutshot = false;
    let backDoorStraight = false;

    // Adiciona Ás como 1 para sequências baixas
    if (values.includes(14)) {
      values = [...values, 1];
    }

    // Verifica sequências abertas e gutshotss
    for (let i = 0; i < values.length - 3; i++) {
      const window = values.slice(i, i + 5);
      const gaps = countGaps(window);
      
      if (gaps === 1) {
        if (!straightDraw) straightDraw = true;
      } else if (gaps === 2) {
        if (window[4] - window[0] === 4) {
          if (!gutshot) gutshot = true;
          else doubleGutshot = true;
        }
      } else if (gaps === 3) {
        backDoorStraight = true;
      }
    }

    return { straightDraw, gutshot, doubleGutshot, backDoorStraight };
  };

  const countGaps = (values: number[]): number => {
    let gaps = 0;
    for (let i = 1; i < values.length; i++) {
      gaps += values[i] - values[i-1] - 1;
    }
    return gaps;
  };

  const analyzeHandStrength = (playerCards: string[], communityCards: string[]): HandAnalysis => {
    const playerParsed = playerCards.map(parseCard).filter(Boolean) as Card[];
    const communityParsed = communityCards.map(parseCard).filter(Boolean) as Card[];
    const allCards = [...playerParsed, ...communityParsed];
    
    if (allCards.length < 2) return { type: 'Desconhecido', strength: 0 };

    const suits: { [key: string]: number } = {};
    const ranks: { [key: string]: number } = {};
    const values = allCards.map(c => c.value).sort((a, b) => b - a);
    
    allCards.forEach(card => {
      suits[card.suit] = (suits[card.suit] || 0) + 1;
      ranks[card.rank] = (ranks[card.rank] || 0) + 1;
    });

    // Analisa potencial de draws
    const drawPotential = analyzeDrawPotential(playerParsed, communityParsed);

    const isFlush = Object.values(suits).some(count => count >= 5);
    const isStraight = checkStraight(values);
    const pairs = Object.values(ranks).filter(count => count >= 2).sort((a, b) => b - a);

    // Verifica se a mão atual é a melhor possível com as cartas da mesa
    const bestPossible = getBestPossibleHand(communityCards);
    const hasQuadraAces = pairs.includes(4) && ranks['A'] === 4;
    const hasRoyalFlush = isFlush && isStraight && values.includes(14) && values.slice(0, 5).every((v, i) => v === 14 - i);

    // Função auxiliar para calcular bônus baseado no rank
    const calculateRankBonus = (rank: string, baseBonus: number): number => {
      const value = rankValues[rank];
      if (value === 14) return baseBonus * 1.5;
      if (value >= 11) return baseBonus * 1.2;
      return (value - 2) * (baseBonus / 12);
    };

    // Calcula bônus baseado no potencial de draws
    const calculateDrawBonus = (): number => {
      let bonus = drawPotential.drawStrength;
      
      // Ajusta bônus baseado no estágio do jogo
      if (communityParsed.length === 3) bonus *= 1.2; // Mais valor no flop
      else if (communityParsed.length === 4) bonus *= 0.8; // Menos valor no turn
      
      return Math.min(bonus, 40); // Máximo de 40% de bônus por draws
    };

    // Ajusta os valores de força para melhor diferenciação
    if (hasRoyalFlush) return { type: 'Royal Flush', strength: 100 };
    if (isFlush && isStraight) {
      if (bestPossible.type !== 'Straight Flush') return { type: 'Straight Flush', strength: 100 };
      return { type: 'Straight Flush', strength: 95 };
    }
    if (pairs.includes(4)) {
      if (hasQuadraAces) return { type: 'Quadra de Ases', strength: 100 };
      
      const quadRank = Object.entries(ranks).find(([_, count]) => count === 4)?.[0];
      if (quadRank) {
        const baseStrength = 85;
        const rankBonus = calculateRankBonus(quadRank, 15); // Até 15% de bônus para quadra
        return { type: 'Quadra', strength: Math.min(baseStrength + rankBonus, 98) };
      }
      return { type: 'Quadra', strength: 85 };
    }
    if (pairs.includes(3) && pairs.includes(2)) {
      const tripRank = Object.entries(ranks).find(([_, count]) => count === 3)?.[0];
      const pairRank = Object.entries(ranks).find(([_, count]) => count === 2)?.[0];
      
      if (tripRank && pairRank) {
        const baseStrength = 80;
        const tripBonus = calculateRankBonus(tripRank, 12); // Até 12% de bônus para a trinca
        const pairBonus = calculateRankBonus(pairRank, 6); // Até 6% de bônus para o par
        return { type: 'Full House', strength: Math.min(baseStrength + tripBonus + pairBonus, 95) };
      }
      return { type: 'Full House', strength: 80 };
    }
    if (isFlush) {
      const flushCards = Object.entries(suits)
        .find(([_, count]) => count >= 5)?.[0];
      if (flushCards) {
        const highestFlushCard = allCards
          .filter(card => card.suit === flushCards)
          .sort((a, b) => b.value - a.value)[0];
        const baseStrength = bestPossible.type === 'Flush' ? 70 : 90;
        const rankBonus = calculateRankBonus(highestFlushCard.rank, 8); // Até 8% de bônus para flush
        return { type: 'Flush', strength: Math.min(baseStrength + rankBonus, 92) };
      }
      return { type: 'Flush', strength: 70 };
    }
    if (isStraight) {
      const highestStraightCard = values[0];
      const baseStrength = bestPossible.type === 'Sequência' ? 65 : 85;
      const rankBonus = (highestStraightCard - 5) * 0.8; // Até 7.2% de bônus (9 cartas * 0.8)
      return { type: 'Sequência', strength: Math.min(baseStrength + rankBonus, 89) };
    }
    if (pairs.includes(3)) {
      const tripRank = Object.entries(ranks).find(([_, count]) => count === 3)?.[0];
      if (tripRank) {
        const baseStrength = bestPossible.type === 'Trinca' ? 50 : 70;
        const rankBonus = calculateRankBonus(tripRank, 20); // Até 20% de bônus para trinca
        const kickers = values.filter(v => v !== rankValues[tripRank]).slice(0, 2);
        const kickerBonus = kickers.reduce((acc, v) => acc + (v - 2) * 0.3, 0); // Até 3.6% por kicker
        return { type: 'Trinca', strength: Math.min(baseStrength + rankBonus + kickerBonus, 88) };
      }
      return { type: 'Trinca', strength: 50 };
    }
    if (pairs.filter(p => p === 2).length >= 2) {
      const pairRanks = Object.entries(ranks)
        .filter(([_, count]) => count === 2)
        .map(([rank, _]) => rank)
        .sort((a, b) => rankValues[b] - rankValues[a]);
      
      if (pairRanks.length >= 2) {
        const baseStrength = bestPossible.type === 'Dois Pares' ? 40 : 60;
        const firstPairBonus = calculateRankBonus(pairRanks[0], 15); // Até 15% para o par maior
        const secondPairBonus = calculateRankBonus(pairRanks[1], 10); // Até 10% para o par menor
        const kicker = values.find(v => !pairRanks.some(r => rankValues[r] === v));
        const kickerBonus = kicker ? (kicker - 2) * 0.3 : 0; // Até 3.6% de bônus do kicker
        return { type: 'Dois Pares', strength: Math.min(baseStrength + firstPairBonus + secondPairBonus + kickerBonus, 83) };
      }
      return { type: 'Dois Pares', strength: 40 };
    }
    if (pairs.includes(2)) {
      const pairRank = Object.entries(ranks).find(([_, count]) => count === 2)?.[0];
      if (pairRank) {
        const baseStrength = bestPossible.type === 'Um Par' ? 30 : 45;
        const rankBonus = calculateRankBonus(pairRank, 25); // Até 25% de bônus para o par
        const kickers = values.filter(v => v !== rankValues[pairRank]).slice(0, 3);
        const kickerBonus = kickers.reduce((acc, v, i) => acc + (v - 2) * (0.4 / (i + 1)), 0); // Bônus decrescente por kicker
        return { type: 'Um Par', strength: Math.min(baseStrength + rankBonus + kickerBonus, 75) };
      }
      return { type: 'Um Par', strength: 30 };
    }
    
    // Carta alta com bônus por kickers
    const baseStrength = bestPossible.type === 'Carta Alta' ? 20 : 30;
    const kickerBonuses = values.slice(0, 5).reduce((acc, v, i) => acc + (v - 2) * (0.5 / (i + 1)), 0);
    const drawBonus = calculateDrawBonus();
    
    const { outs, draws } = calculateAdvancedOuts(playerCards, communityCards);
    
    return { 
      type: 'Carta Alta', 
      strength: Math.min(baseStrength + kickerBonuses + drawBonus, 45),
      drawPotential,
      outs,
      draws
    };
  };

  const calculateAdvancedOuts = (playerCards: string[], communityCards: string[]) => {
    let outs = 0;
    const draws: Draw[] = [];
    const suitCounts: { [key: string]: number } = {};

    // Count suits
    [...playerCards, ...communityCards].forEach(card => {
      if (card) {
        const suit = card.slice(-1);
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
      }
    });

    // Check for flush draws
    Object.entries(suitCounts).forEach(([suit, count]) => {
      if (count === 4) {
        outs += 9;
        draws.push({ type: 'Flush Draw', outs: 9, probability: 19.1 });
      }
    });

    return { outs: Math.min(outs, 20), draws };
  };

  const calculateStraightOuts = (values: number[]): number => {
    const unique = [...new Set(values)].sort((a, b) => a - b);
    let maxOuts = 0;
    
    for (let i = 0; i < unique.length; i++) {
      let consecutive = 1;
      let gaps = 0;
      
      for (let j = i + 1; j < unique.length && j < i + 5; j++) {
        if (unique[j] === unique[j-1] + 1) {
          consecutive++;
        } else if (unique[j] === unique[j-1] + 2) {
          gaps++;
          consecutive++;
        }
      }
      
      if (consecutive >= 4) {
        if (gaps === 0) maxOuts = Math.max(maxOuts, 8);
        else maxOuts = Math.max(maxOuts, 4);
      }
    }
    
    return maxOuts;
  };

  const calculateAdvancedMetrics = () => {
    if (potSize === '' || betToCall === '') {
      alert('Por favor, preencha o tamanho do pote e a aposta para pagar com valores válidos.');
      return null;
    }
    
    if (!playerCards[0] || !playerCards[1]) {
      alert('Por favor, selecione suas cartas antes de analisar.');
      return null;
    }

    const validPlayerCards = playerCards.filter(card => card);
    const validCommunityCards = communityCards.filter(card => card);
    
    if (validPlayerCards.length < 2) return null;

    const result = analyzeHandStrength(validPlayerCards, validCommunityCards);
    setHandStrength({ type: result.type, strength: result.strength });
    
    const drawPotential = result.drawPotential;
    const cardsToSee = Math.max(0, 5 - validCommunityCards.length);
    
    // Ajusta probabilidade baseado nos draws possíveis
    let winProbability = result.strength;
    if (cardsToSee > 0 && drawPotential) {
      const drawBonus = drawPotential.drawStrength * (cardsToSee / 2);
      winProbability = Math.min(winProbability + drawBonus, 100);
    }

    // Ajusta probabilidade baseado no número de oponentes
    // Quanto mais oponentes, menor a chance de vencer
    const opponentAdjustment = (opponents - 1) * (
      result.type === 'Carta Alta' ? 0.4 :
      result.type === 'Um Par' ? 0.35 :
      result.type === 'Dois Pares' ? 0.3 :
      result.type === 'Trinca' ? 0.25 :
      result.type === 'Sequência' ? 0.2 :
      result.type === 'Flush' ? 0.2 :
      result.type === 'Full House' ? 0.15 :
      result.type === 'Quadra' ? 0.1 :
      result.type === 'Straight Flush' || result.type === 'Royal Flush' ? 0.05 : 0.3
    );

    // Ajusta probabilidade baseado no estágio do jogo
    const stageMultiplier = 
      validCommunityCards.length === 0 ? 0.9 :  // Pre-flop
      validCommunityCards.length === 3 ? 1.0 :  // Flop
      validCommunityCards.length === 4 ? 1.1 :  // Turn
      1.2;                                      // River

    // Calcula probabilidade final
    const adjustedWinProbability = Math.min(
      Math.max((winProbability * stageMultiplier) / (1 + opponentAdjustment), 0),
      100
    );

    const potOdds = (betToCall / (potSize + betToCall)) * 100;
    const impliedOdds = calculateImpliedOdds(potSize, betToCall, adjustedWinProbability, position);
    const directEV = ((adjustedWinProbability / 100) * potSize) - (((100 - adjustedWinProbability) / 100) * betToCall);
    
    // Ajusta fold equity baseado na força da mão e posição
    const baseFoldEquity = position === 'late' ? 20 : position === 'middle' ? 15 : 10;
    const foldEquity = Math.min(
      baseFoldEquity * (1 + (result.strength / 100)),
      position === 'late' ? 35 : position === 'middle' ? 25 : 15
    );
    
    return {
      outs: result.outs || 0,
      draws: result.draws || [],
      winProbability: adjustedWinProbability.toFixed(1),
      potOdds: potOdds.toFixed(1),
      impliedOdds: impliedOdds.toFixed(1),
      expectedValue: directEV,
      shouldCall: adjustedWinProbability > potOdds || adjustedWinProbability > impliedOdds,
      foldEquity,
      handStrength: { type: result.type, strength: result.strength },
      drawPotential
    };
  };

  const calculateImpliedOdds = (potSize: number, betToCall: number, winProbability: number, position: string): number => {
    let impliedMultiplier = 1;
    
    if (position === 'early') impliedMultiplier = 0.8;
    else if (position === 'late') impliedMultiplier = 1.3;
    
    if (winProbability > 30) impliedMultiplier *= 1.2;
    
    const impliedPot = potSize * impliedMultiplier;
    return (betToCall / (impliedPot + betToCall)) * 100;
  };

  const analyzeHand = () => {
    if (potSize === '' || betToCall === '') {
      alert('Por favor, preencha o tamanho do pote e a aposta para pagar com valores válidos.');
      return;
    }
    
    if (!playerCards[0] || !playerCards[1]) {
      alert('Por favor, selecione suas cartas antes de analisar.');
      return;
    }

    const result = calculateAdvancedMetrics();
    setResults(result);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Calculator className="text-green-400" />
            Assistente de Poker
          </h1>
          <p className="text-green-200">Selecione suas cartas e obtenha análise profissional</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-green-500/20">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Suas Cartas</h3>
              <div className="flex gap-4 justify-center">
                {playerCards.map((card, i) => (
                  <CardDisplay
                    key={i}
                    card={card}
                    onClick={() => openCardSelector('player', i)}
                    onClear={() => clearCard('player', i)}
                    placeholder={`Carta ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-green-500/20">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Mesa</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Flop</h4>
                  <div className="flex gap-2 justify-center">
                    {communityCards.slice(0, 3).map((card, i) => (
                      <CardDisplay
                        key={i}
                        card={card}
                        onClick={() => openCardSelector('community', i)}
                        onClear={() => clearCard('community', i)}
                        placeholder="?"
                        small={true}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Turn e River</h4>
                  <div className="flex gap-2 justify-center">
                    {communityCards.slice(3).map((card, i) => (
                      <CardDisplay
                        key={i + 3}
                        card={card}
                        onClick={() => openCardSelector('community', i + 3)}
                        onClear={() => clearCard('community', i + 3)}
                        placeholder="?"
                        small={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-green-500/20">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Situação do Jogo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho do Pote</label>
                  <input
                    type="number"
                    value={potSize}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                      setPotSize(value);
                    }}
                    placeholder="Ex: 100"
                    min="0"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-green-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Aposta para Pagar</label>
                  <input
                    type="number"
                    value={betToCall}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                      setBetToCall(value);
                    }}
                    placeholder="Ex: 20"
                    min="0"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-green-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Oponentes Ativos</label>
                  <select
                    value={opponents}
                    onChange={(e) => setOpponents(Number(e.target.value))}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-green-400 text-white"
                  >
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Posição</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as 'early' | 'middle' | 'late')}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-green-400 text-white"
                  >
                    <option value="early">Posição Inicial</option>
                    <option value="middle">Posição Média</option>
                    <option value="late">Posição Final</option>
                  </select>
                </div>

                <button
                  onClick={analyzeHand}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  <Calculator className="w-5 h-5" />
                  Analisar Mão
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {results ? (
              <>
                <div className="bg-gray-800 p-6 rounded-xl border border-green-500/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {handStrength?.type || 'Carta Alta'}
                    </div>
                    <div className="text-xl text-gray-300">
                      Probabilidade de Vitória: {results.winProbability}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-xl border border-blue-500/20">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Probabilidades
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Outs:</span>
                        <span className="font-mono text-lg text-blue-300">{results.outs}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Odds do Pote:</span>
                        <span className="font-mono text-lg">{results.potOdds}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Odds Implícitas:</span>
                        <span className="font-mono text-lg text-yellow-400">{results.impliedOdds}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-xl border border-green-500/20">
                    <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Valor Esperado
                    </h3>
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${results.expectedValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {results.expectedValue >= 0 ? '+' : ''}{results.expectedValue.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {results.expectedValue >= 0 ? 'Pagamento lucrativo' : 'Pagamento não lucrativo'}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Equity de Fold: {results.foldEquity}%
                      </div>
                    </div>
                  </div>
                </div>

                {results.draws && results.draws.length > 0 && (
                  <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/20">
                    <h3 className="text-xl font-semibold mb-4 text-purple-400">Análise de Draws</h3>
                    <div className="space-y-2">
                      {results.draws.map((draw, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                          <span className="text-purple-300">
                            {draw.type === 'Flush Draw' ? 'Draw de Flush' :
                             draw.type === 'Open-Ended Straight' ? 'Sequência Aberta' :
                             'Sequência Interna'}
                          </span>
                          <div className="text-right">
                            <div className="font-mono">{draw.outs} outs</div>
                            <div className="text-sm text-gray-400">{draw.probability}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800 p-6 rounded-xl border border-green-500/20">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Resultados da Análise</h3>
                <p className="text-gray-400">Selecione suas cartas e clique em "Analisar Mão" para ver a análise</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CardSelector />
    </div>
  );
};

export default PokerAssistant; 