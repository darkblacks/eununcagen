# Eu Nunca Generation

Aplicação web interativa do jogo **Eu Nunca**, desenvolvida para turmas da **Generation Brasil**, com autenticação, votação em tempo real, controle de presença online e ranking final.

O projeto foi construído para proporcionar uma experiência simples, visual e dinâmica durante a brincadeira, permitindo que os participantes entrem com suas contas, acompanhem as perguntas, votem e visualizem o andamento da rodada.

---

## Visão geral

O sistema funciona em torno de uma sala principal, onde:

- os usuários entram com login já cadastrado
- o administrador controla o início e o avanço das rodadas
- os participantes votam em cada pergunta
- a aplicação mostra quem está online
- a interface indica quem já votou e quem ainda está aguardando
- ao final, o ranking consolida os resultados da partida

---

## Funcionalidades

### Autenticação
- Login de usuários via **Firebase Authentication**
- Separação de perfil entre **admin** e **student**

### Fluxo do jogo
- Tela de espera antes do início da partida
- Início da rodada pelo administrador
- Exibição da pergunta atual
- Registro do voto de cada participante
- Proteção para evitar voto duplicado na mesma pergunta
- Avanço de perguntas até o ranking final

### Presença e acompanhamento
- Lista de participantes online
- Atualização automática da presença dos usuários
- Indicação visual de quem:
  - já votou
  - ainda está aguardando voto

### Ranking
- Contagem total de:
  - **Eu Já**
  - **Eu Nunca**
- Ranking final por participante
- Exibição consolidada dos resultados da partida

### Interface
- Layout moderno e responsivo
- Alternância de tema
- Feedback visual durante sincronização e votação

---

## Tecnologias utilizadas

### Front-end
- **React**
- **TypeScript**
- **Vite**

### Serviços e banco
- **Firebase Authentication** para login
- **Supabase** para persistência dos dados do jogo

### Visualização
- **ECharts**
- **echarts-for-react**

---

## Estrutura principal do projeto

```bash
src/
├── assets/               # imagens e arquivos visuais
├── components/           # componentes reutilizáveis
├── context/              # AuthContext, GameContext, ThemeContext
├── data/                 # perguntas do jogo
├── pages/                # Login, Waiting, Game, Ranking, AdminPanel
├── routes/               # roteamento principal da aplicação
├── services/             # integração com Firebase e Supabase
├── styles/               # estilos globais
├── types/                # tipagens TypeScript
├── utils/                # constantes e utilitários
├── App.tsx
├── main.tsx
└── supabase.ts
