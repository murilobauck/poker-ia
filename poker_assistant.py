"""
Assistente de Poker - Interface Gráfica
"""
import tkinter as tk
from tkinter import ttk, messagebox
from poker_logic import PokerLogic

class PokerGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Assistente de Poker")
        self.root.geometry("800x800")
        self.logic = PokerLogic()
        
        # Estilo
        self.style = ttk.Style()
        self.style.configure('TButton', padding=5)
        self.style.configure('TLabel', padding=3)
        self.style.configure('TFrame', padding=5)
        
        # Cartas disponíveis
        ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
        suits = ['♠', '♥', '♦', '♣']
        self.card_options = [f"{r}{s}" for r in ranks for s in suits]
        
        # Dicionário para rastrear cartas selecionadas
        self.selected_cards = {}
        
        self.setup_ui()
        
    def setup_ui(self):
        # Frame principal com scroll
        main_canvas = tk.Canvas(self.root)
        scrollbar = ttk.Scrollbar(self.root, orient="vertical", command=main_canvas.yview)
        scrollable_frame = ttk.Frame(main_canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: main_canvas.configure(scrollregion=main_canvas.bbox("all"))
        )

        main_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        main_canvas.configure(yscrollcommand=scrollbar.set)
        
        # Cartas do jogador
        ttk.Label(scrollable_frame, text="Suas cartas:").pack(anchor='w', padx=10)
        hand_frame = ttk.Frame(scrollable_frame)
        hand_frame.pack(fill='x', pady=(0, 10), padx=10)
        
        self.hole1 = ttk.Combobox(hand_frame, values=self.card_options, width=4, state="readonly")
        self.hole1.pack(side='left', padx=2)
        self.hole1_label = tk.Label(hand_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.hole1_label.pack(side='left', padx=2)
        
        self.hole2 = ttk.Combobox(hand_frame, values=self.card_options, width=4, state="readonly")
        self.hole2.pack(side='left', padx=2)
        self.hole2_label = tk.Label(hand_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.hole2_label.pack(side='left', padx=2)
        
        # Cartas do oponente (opcional)
        ttk.Label(scrollable_frame, text="Cartas do oponente (opcional):").pack(anchor='w', padx=10)
        opp_frame = ttk.Frame(scrollable_frame)
        opp_frame.pack(fill='x', pady=(0, 10), padx=10)
        
        self.opp1 = ttk.Combobox(opp_frame, values=self.card_options, width=4, state="readonly")
        self.opp1.pack(side='left', padx=2)
        self.opp1_label = tk.Label(opp_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.opp1_label.pack(side='left', padx=2)
        
        self.opp2 = ttk.Combobox(opp_frame, values=self.card_options, width=4, state="readonly")
        self.opp2.pack(side='left', padx=2)
        self.opp2_label = tk.Label(opp_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.opp2_label.pack(side='left', padx=2)
        
        # Cartas da mesa
        ttk.Label(scrollable_frame, text="Cartas da mesa:").pack(anchor='w', padx=10)
        board_frame = ttk.Frame(scrollable_frame)
        board_frame.pack(fill='x', pady=(0, 10), padx=10)
        
        # Flop
        self.flop1 = ttk.Combobox(board_frame, values=self.card_options, width=4, state="readonly")
        self.flop1.pack(side='left', padx=2)
        self.flop1_label = tk.Label(board_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.flop1_label.pack(side='left', padx=2)
        
        self.flop2 = ttk.Combobox(board_frame, values=self.card_options, width=4, state="readonly")
        self.flop2.pack(side='left', padx=2)
        self.flop2_label = tk.Label(board_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.flop2_label.pack(side='left', padx=2)
        
        self.flop3 = ttk.Combobox(board_frame, values=self.card_options, width=4, state="readonly")
        self.flop3.pack(side='left', padx=2)
        self.flop3_label = tk.Label(board_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.flop3_label.pack(side='left', padx=2)
        
        # Turn
        self.turn = ttk.Combobox(board_frame, values=self.card_options, width=4, state="readonly")
        self.turn.pack(side='left', padx=2)
        self.turn_label = tk.Label(board_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.turn_label.pack(side='left', padx=2)
        
        # River
        self.river = ttk.Combobox(board_frame, values=self.card_options, width=4, state="readonly")
        self.river.pack(side='left', padx=2)
        self.river_label = tk.Label(board_frame, text="", width=4, font=("Arial", 12, "bold"))
        self.river_label.pack(side='left', padx=2)
        
        # Valores do jogo
        values_frame = ttk.LabelFrame(scrollable_frame, text="Valores do jogo", padding=10)
        values_frame.pack(fill='x', pady=10, padx=10)
        
        ttk.Label(values_frame, text="Pot:").grid(row=0, column=0, padx=5)
        self.pot = ttk.Entry(values_frame, width=10)
        self.pot.grid(row=0, column=1, padx=5)
        
        ttk.Label(values_frame, text="Stack:").grid(row=0, column=2, padx=5)
        self.stack = ttk.Entry(values_frame, width=10)
        self.stack.grid(row=0, column=3, padx=5)
        
        ttk.Label(values_frame, text="Aposta:").grid(row=0, column=4, padx=5)
        self.bet = ttk.Entry(values_frame, width=10)
        self.bet.grid(row=0, column=5, padx=5)
        
        # Posição e perfil do oponente
        info_frame = ttk.LabelFrame(scrollable_frame, text="Informações da mesa", padding=10)
        info_frame.pack(fill='x', pady=10, padx=10)
        
        ttk.Label(info_frame, text="Posição:").grid(row=0, column=0, padx=5)
        self.position = ttk.Combobox(info_frame, values=['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'], width=5, state="readonly")
        self.position.grid(row=0, column=1, padx=5)
        self.position.set('BTN')
        
        ttk.Label(info_frame, text="Estilo do oponente:").grid(row=0, column=2, padx=5)
        self.opponent_style = ttk.Combobox(info_frame, values=['tight', 'loose'], width=8, state="readonly")
        self.opponent_style.grid(row=0, column=3, padx=5)
        self.opponent_style.set('tight')
        
        ttk.Label(info_frame, text="Agressividade:").grid(row=0, column=4, padx=5)
        self.opponent_aggression = ttk.Combobox(info_frame, values=['passive', 'aggressive'], width=10, state="readonly")
        self.opponent_aggression.grid(row=0, column=5, padx=5)
        self.opponent_aggression.set('passive')
        
        # Botões
        buttons_frame = ttk.Frame(scrollable_frame)
        buttons_frame.pack(fill='x', pady=10, padx=10)
        
        ttk.Button(buttons_frame, text="Calcular", command=self.calculate).pack(side='left', padx=5)
        ttk.Button(buttons_frame, text="Limpar", command=self.reset).pack(side='left', padx=5)
        
        # Área de resultado
        result_frame = ttk.LabelFrame(scrollable_frame, text="Análise", padding=10)
        result_frame.pack(fill='both', expand=True, pady=10, padx=10)
        
        self.result_text = tk.Text(result_frame, height=10, wrap='word')
        self.result_text.pack(fill='both', expand=True)
        
        # Configurar scroll
        main_canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Bind eventos de atualização de cartas
        self.card_combos = {
            'hole1': self.hole1,
            'hole2': self.hole2,
            'opp1': self.opp1,
            'opp2': self.opp2,
            'flop1': self.flop1,
            'flop2': self.flop2,
            'flop3': self.flop3,
            'turn': self.turn,
            'river': self.river
        }
        
        self.card_labels = {
            'hole1': self.hole1_label,
            'hole2': self.hole2_label,
            'opp1': self.opp1_label,
            'opp2': self.opp2_label,
            'flop1': self.flop1_label,
            'flop2': self.flop2_label,
            'flop3': self.flop3_label,
            'turn': self.turn_label,
            'river': self.river_label
        }
        
        # Bind eventos para todos os Combobox
        for name, combo in self.card_combos.items():
            combo.bind("<<ComboboxSelected>>", lambda e, n=name: self.on_card_selected(n))
            
    def on_card_selected(self, combo_name):
        """Manipula a seleção de uma carta."""
        combo = self.card_combos[combo_name]
        label = self.card_labels[combo_name]
        selected_card = combo.get()
        
        # Se a carta estava previamente selecionada em outro combo, limpa a seleção anterior
        if selected_card:
            for name, prev_card in self.selected_cards.items():
                if name != combo_name and prev_card == selected_card:
                    self.card_combos[name].set('')
                    self.card_labels[name].config(text="", fg="black")
                    del self.selected_cards[name]
                    break
            
            # Atualiza o dicionário de cartas selecionadas
            self.selected_cards[combo_name] = selected_card
        else:
            if combo_name in self.selected_cards:
                del self.selected_cards[combo_name]
        
        # Atualiza o display da carta
        self.update_card_display(combo_name)
        
        # Atualiza as opções disponíveis para todos os combos
        self.update_available_cards()
            
    def update_card_display(self, combo_name):
        """Atualiza o display colorido da carta selecionada."""
        combo = self.card_combos[combo_name]
        label = self.card_labels[combo_name]
        card = combo.get()
        
        if not card:
            label.config(text="", fg="black")
            return
            
        # Define a cor baseada no naipe
        if card[-1] in ['♥', '♦']:
            label.config(text=card, fg="red")
        else:
            label.config(text=card, fg="black")
            
    def update_available_cards(self):
        """Atualiza as opções disponíveis em todos os Combobox."""
        # Obtém todas as cartas selecionadas
        used_cards = set(self.selected_cards.values())
        
        # Calcula cartas disponíveis
        available_cards = [c for c in self.card_options if c not in used_cards]
        
        # Atualiza as opções em cada Combobox
        for name, combo in self.card_combos.items():
            current = combo.get()
            new_values = available_cards + ([current] if current else [])
            combo['values'] = sorted(new_values)
            
    def validate_cards(self):
        """Valida se há cartas repetidas ou inválidas."""
        # Verifica cartas repetidas
        selected = [card for card in self.selected_cards.values() if card]
        if len(selected) != len(set(selected)):
            raise ValueError("Há cartas repetidas selecionadas!")
            
        # Verifica sequência de cartas da mesa
        board_cards = [
            self.flop1.get(), self.flop2.get(), self.flop3.get(),
            self.turn.get(), self.river.get()
        ]
        
        # Se tem river, precisa ter turn
        if board_cards[4] and not board_cards[3]:
            raise ValueError("Não pode ter River sem Turn!")
            
        # Se tem turn, precisa ter flop completo
        if board_cards[3] and not all(board_cards[:3]):
            raise ValueError("Não pode ter Turn sem Flop completo!")
            
        # Se tem alguma carta do flop, precisa ter o flop completo
        if any(board_cards[:3]) and not all(board_cards[:3]):
            raise ValueError("O Flop deve estar completo!")
            
    def calculate(self):
        """Calcula a recomendação."""
        try:
            # Valida as cartas
            self.validate_cards()
            
            # Coleta os dados
            hole_cards = [self.hole1.get(), self.hole2.get()]
            opponent_cards = [self.opp1.get(), self.opp2.get()]
            if not opponent_cards[0] or not opponent_cards[1]:
                opponent_cards = None
            
            board = [c for c in [
                self.flop1.get(), self.flop2.get(), self.flop3.get(),
                self.turn.get(), self.river.get()
            ] if c]
            
            # Valida entrada
            if not hole_cards[0] or not hole_cards[1]:
                raise ValueError("Por favor, selecione suas duas cartas")
                
            # Coleta outros dados
            try:
                pot_size = float(self.pot.get() or 0)
                stack = float(self.stack.get() or 0)
                to_call = float(self.bet.get() or 0)
            except ValueError:
                raise ValueError("Os valores de pot, stack e aposta devem ser números")
                
            position = self.position.get()
            opponent_profile = {
                'style': self.opponent_style.get(),
                'aggression': self.opponent_aggression.get()
            }
            
            # Analisa a situação
            result = self.logic.analyze_hand(
                hole_cards, board, position,
                pot_size, to_call, stack,
                opponent_profile, opponent_cards
            )
            
            # Formata e exibe o resultado
            self.display_result(result)
            
        except ValueError as e:
            messagebox.showerror("Erro", str(e))
        except Exception as e:
            messagebox.showerror("Erro", f"Erro inesperado: {str(e)}")
            
    def display_result(self, result):
        """Exibe o resultado formatado na área de texto."""
        self.result_text.delete(1.0, tk.END)
        
        action = result['action'].upper()
        amount = result['amount']
        reason = result['reason']
        
        if action == 'RAISE':
            action_text = f"RAISE para {amount}"
        elif action == 'CALL':
            action_text = f"CALL {amount}"
        else:
            action_text = action
            
        output = f"""Recomendação: {action_text}

Justificativa:
{reason}

"""
        self.result_text.insert(tk.END, output)
        
    def reset(self):
        """Limpa todos os campos."""
        # Limpa o dicionário de cartas selecionadas
        self.selected_cards.clear()
        
        # Limpa as cartas
        for combo in self.card_combos.values():
            combo.set("")
            combo['values'] = self.card_options
            
        # Limpa os labels
        for label in self.card_labels.values():
            label.config(text="", fg="black")
            
        # Limpa os valores
        self.pot.delete(0, tk.END)
        self.stack.delete(0, tk.END)
        self.bet.delete(0, tk.END)
        
        # Reset dos combos
        self.position.set('BTN')
        self.opponent_style.set('tight')
        self.opponent_aggression.set('passive')
        
        # Limpa o resultado
        self.result_text.delete(1.0, tk.END)

if __name__ == "__main__":
    gui = PokerGUI()
    gui.root.mainloop()