"""
Lógica principal do assistente de poker.
"""
import pokerlib
from gto_ranges import get_hand_strength, should_open, should_threebet

class PokerLogic:
    def __init__(self):
        self.positions = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']
        self.cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
        self.suits = ['♠', '♥', '♦', '♣']
        
    def calculate_pot_odds(self, to_call, pot_size):
        """Calcula as pot odds."""
        if pot_size == 0 or to_call == 0:
            return 0
        return (to_call / (pot_size + to_call)) * 100

    def calculate_equity(self, hole_cards, board, opponent_cards=None):
        """
        Calcula a equity usando pokerlib.
        Se opponent_cards não for fornecido, usa um range aproximado.
        """
        if not hole_cards or len(hole_cards) != 2:
            return 0

        # Converte cartas para o formato do pokerlib (As, Kh, etc)
        hole = [self._convert_card_to_pokerlib(c) for c in hole_cards]
        board = [self._convert_card_to_pokerlib(c) for c in (board or [])]
        
        if opponent_cards and len(opponent_cards) == 2:
            # Se temos as cartas do oponente, calcula heads-up
            villain = [self._convert_card_to_pokerlib(c) for c in opponent_cards]
            equity = pokerlib.equity([hole, villain], board)
            return equity[0] * 100  # Converte para porcentagem
        else:
            # Caso contrário, usa um range aproximado
            equity = pokerlib.equity_vs_range(hole, board)
            return equity * 100

    def _convert_card_to_pokerlib(self, card):
        """Converte carta do formato A♠ para As (formato pokerlib)."""
        suit_map = {'♠': 's', '♥': 'h', '♦': 'd', '♣': 'c'}
        if len(card) != 2:
            return None
        rank, suit = card[0], card[1]
        return f"{rank.lower()}{suit_map.get(suit, '')}"

    def calculate_fold_equity(self, opponent_profile):
        """Calcula fold equity baseado no perfil do oponente."""
        base_fold_equity = 50  # Base fold equity em %
        
        # Ajustes baseados no perfil
        if opponent_profile.get('style') == 'tight':
            base_fold_equity += 15
        elif opponent_profile.get('style') == 'loose':
            base_fold_equity -= 15
            
        if opponent_profile.get('aggression') == 'passive':
            base_fold_equity += 10
        elif opponent_profile.get('aggression') == 'aggressive':
            base_fold_equity -= 10
            
        return max(0, min(100, base_fold_equity))

    def get_bet_sizing(self, pot_size, hand_strength, opponent_profile, is_value_bet=True):
        """Determina o tamanho ideal da aposta."""
        if is_value_bet:
            # Value bets: 50-75% do pote
            base_sizing = 0.65 * pot_size
            if opponent_profile.get('style') == 'loose':
                base_sizing *= 1.2
            elif opponent_profile.get('style') == 'tight':
                base_sizing *= 0.8
        else:
            # Bluffs: 33-50% do pote
            base_sizing = 0.4 * pot_size
            if opponent_profile.get('aggression') == 'passive':
                base_sizing *= 0.8
            elif opponent_profile.get('aggression') == 'aggressive':
                base_sizing *= 1.2
        
        return round(base_sizing, 2)

    def analyze_hand(self, hole_cards, board, position, pot_size, to_call, stack, opponent_profile, opponent_cards=None):
        """Analisa a situação e retorna uma recomendação."""
        hand_str = self.convert_cards_to_code(hole_cards)
        hand_strength = get_hand_strength(hand_str)
        
        # Cálculos básicos
        pot_odds = self.calculate_pot_odds(to_call, pot_size)
        equity = self.calculate_equity(hole_cards, board, opponent_cards)
        fold_equity = self.calculate_fold_equity(opponent_profile)
        
        # Análise pré-flop
        if not board:
            return self.preflop_analysis(hand_str, position, pot_size, to_call, stack, opponent_profile)
            
        # Análise pós-flop
        return self.postflop_analysis(equity, pot_odds, fold_equity, pot_size, to_call, stack, opponent_profile)

    def preflop_analysis(self, hand, position, pot_size, to_call, stack, opponent_profile):
        """Análise de situação pré-flop."""
        if should_open(hand, position):
            bet_size = min(3 * pot_size, stack)
            return {
                'action': 'raise',
                'amount': bet_size,
                'reason': f'Mão forte ({hand}) para abrir da posição {position}'
            }
        
        if should_threebet(hand, position):
            bet_size = min(3 * to_call, stack)
            return {
                'action': 'raise',
                'amount': bet_size,
                'reason': f'Mão ideal para 3-bet ({hand}) da posição {position}'
            }
            
        if self.calculate_pot_odds(to_call, pot_size) < 20:
            return {
                'action': 'fold',
                'amount': 0,
                'reason': 'Pot odds desfavoráveis para call'
            }
            
        return {
            'action': 'call',
            'amount': to_call,
            'reason': 'Pot odds favoráveis para call'
        }

    def postflop_analysis(self, equity, pot_odds, fold_equity, pot_size, to_call, stack, opponent_profile):
        """Análise de situação pós-flop."""
        if equity > pot_odds + 5:  # +5% de margem
            # Value bet
            bet_size = self.get_bet_sizing(pot_size, equity/10, opponent_profile, True)
            return {
                'action': 'raise',
                'amount': min(bet_size, stack),
                'reason': f'Value bet com {equity:.1f}% equity vs {pot_odds:.1f}% pot odds'
            }
        elif fold_equity > 60 and equity > 30:
            # Semi-bluff
            bet_size = self.get_bet_sizing(pot_size, equity/10, opponent_profile, False)
            return {
                'action': 'raise',
                'amount': min(bet_size, stack),
                'reason': f'Semi-bluff com {fold_equity}% fold equity e {equity:.1f}% equity'
            }
        elif equity > pot_odds - 5:  # -5% de margem para calls
            return {
                'action': 'call',
                'amount': to_call,
                'reason': f'Call com odds marginais ({equity:.1f}% equity vs {pot_odds:.1f}% pot odds)'
            }
        else:
            return {
                'action': 'fold',
                'amount': 0,
                'reason': f'Fold com equity insuficiente ({equity:.1f}% vs {pot_odds:.1f}% necessário)'
            }

    def convert_cards_to_code(self, cards):
        """Converte cartas do formato A♠ K♥ para AKs/AKo."""
        if not cards or len(cards) < 2:
            return ''
            
        card1, card2 = cards[:2]
        rank1, suit1 = card1[0], card1[1]
        rank2, suit2 = card2[0], card2[1]
        
        # Ordena as cartas pelo rank
        if self.cards.index(rank2) > self.cards.index(rank1):
            rank1, rank2 = rank2, rank1
            suit1, suit2 = suit2, suit1
            
        # Determina se é suited ou offsuit
        suffix = 's' if suit1 == suit2 else 'o'
        return f"{rank1}{rank2}{suffix}"