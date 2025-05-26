# 🎲 Poker AI Assistant

Uma aplicação inteligente para análise de jogadas de Poker Texas Hold'em. Abaixo, você encontrará uma explicação detalhada sobre o projeto, sua estrutura, funcionalidades e instruções para execução.

---

## 🌐 Demo

O projeto está disponível online em: [poker-ia.vercel.app](https://poker-ia.vercel.app)

---

## ✨ Funcionalidades Principais

- 🎴 Seleção interativa de cartas do jogador e da mesa
- 💰 Cálculo de odds do pote e odds implícitas
- 📊 Análise de probabilidade de vitória
- 🎯 Avaliação de draws (flush, straight, etc.)
- 💵 Cálculo de valor esperado (EV)
- 🔄 Análise de equity de fold
- 📍 Ajuste baseado na posição do jogador
- 👥 Consideração do número de oponentes

---

## 🏗️ Como Executar o Projeto

### Pré-requisitos
- Node.js
- npm ou yarn
- Git

### Instalação e Execução
```bash
# Clone o repositório
git clone https://github.com/murilobauck/poker-ai.git

# Acesse a pasta do projeto
cd poker-ai

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

Acesse `http://localhost:5173` no seu navegador

---

## 📊 Tabela de Classificação de Mãos

| Mão             | Força Relativa | Descrição                    |
|-----------------|----------------|------------------------------|
| Royal Flush     | 100%          | Sequência real do mesmo naipe|
| Straight Flush  | 95%           | Sequência do mesmo naipe     |
| Quadra         | 85-98%        | Quatro cartas iguais        |
| Full House     | 80-95%        | Trinca + Par                |
| Flush          | 70-92%        | Cinco cartas do mesmo naipe |
| Straight       | 65-89%        | Cinco cartas em sequência   |
| Trinca         | 50-88%        | Três cartas iguais         |
| Dois Pares     | 40-83%        | Dois pares diferentes      |
| Par            | 30-75%        | Duas cartas iguais         |
| Carta Alta     | 20-45%        | Nenhuma combinação         |

---

## 🛠️ Estrutura do Código

O código está organizado em componentes principais:

- **[PokerAssistant]**: Componente principal que gerencia toda a lógica do jogo
- **[CardSelector]**: Responsável pela seleção interativa de cartas
- **[CardDisplay]**: Renderiza as cartas na interface
- **[HandAnalyzer]**: Analisa a força das mãos e calcula probabilidades

---

## 🚀 Tecnologias Utilizadas

- **Framework**: React
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide Icons
- **Build Tool**: Vite
- **Deploy**: Vercel

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 👋 Contato

Feito por Murilo Bauck - [Entre em contato!](https://www.linkedin.com/in/murilo-bauck-515958306/) 