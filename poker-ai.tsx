import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Target, DollarSign, BarChart3, X } from 'lucide-react';
import './styles.css';

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

const PokerAssistant: React.FC = () => {
  const [playerCards, setPlayerCards] = useState<string[]>(['', '']);
  const [communityCards, setCommunityCards] = useState<string[]>(['', '', '', '', '']);
  const [potSize, setPotSize] = useState<number>(100);
  const [betToCall, setBetToCall] = useState<number>(20);
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 text-white min-h-screen">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tamanho do Pote</label>
          <input
            value={potSize}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPotSize(value === '' ? 0 : Math.max(0, Number(value)));
            }}
            placeholder="Ex: 100"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-green-400 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Aposta para Pagar</label>
          <input
            value={betToCall}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setBetToCall(value === '' ? 0 : Math.max(0, Number(value)));
            }}
            placeholder="Ex: 20"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-green-400 text-white"
          />
        </div>
      </div>
      {/* ... rest of your JSX ... */}
    </div>
  );
};

export default PokerAssistant; 