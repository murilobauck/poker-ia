# Assistente de Poker

Um assistente de poker com interface gráfica que ajuda na tomada de decisões durante o jogo, baseado em análise GTO (Game Theory Optimal) com ajustes exploitativos.

## Funcionalidades

- Análise de força da mão
- Cálculo de pot odds
- Cálculo de equity em tempo real
- Análise de fold equity
- Recomendações baseadas em GTO
- Ajustes baseados no perfil do oponente
- Interface gráfica intuitiva com:
  - Seleção de cartas com cores (vermelho para ♥♦, preto para ♠♣)
  - Validação para evitar cartas repetidas
  - Campos para cartas do oponente (opcional)
  - Entrada de valores do jogo (pot, stack, aposta)
  - Configuração de posição e perfil do oponente

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/poker-ai.git
cd poker-ai
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Uso

1. Execute o programa:
```bash
python poker_assistant.py
```

2. Na interface:
   - Selecione suas cartas
   - (Opcional) Selecione as cartas do oponente se conhecidas
   - Adicione as cartas da mesa (flop, turn, river) conforme disponíveis
   - Insira os valores do jogo (pot, stack, aposta)
   - Selecione sua posição
   - Configure o perfil do oponente
   - Clique em "Calcular" para receber a recomendação

## Criando um Executável

Para criar um executável standalone:

```bash
pyinstaller --onefile --windowed poker_assistant.py
```

O executável será criado na pasta `dist`.

## Estrutura do Projeto

- `poker_assistant.py`: Interface gráfica usando Tkinter
- `poker_logic.py`: Lógica do jogo e cálculos
- `gto_ranges.py`: Ranges de mãos GTO
- `requirements.txt`: Dependências do projeto

## Dependências

- Python 3.8+
- numpy: Cálculos numéricos
- pillow: Processamento de imagens
- pyinstaller: Criação de executável
- pokerlib: Cálculos de equity

## Contribuindo

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes. 