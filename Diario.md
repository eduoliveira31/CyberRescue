# Diário de Desenvolvimento — Cyber-Rescue

## Sessão 1 — 26 de novembro de 2026

### Objetivo
Criar o repositório do projeto, configurar os ficheiros a ignorar e montar a estrutura inicial do jogo em Phaser v4, com cenas base e placeholders geométricos para testar no browser.

### Atividades realizadas
- Criação do repositório e do `.gitignore` (documentos locais da proposta e ficheiros PDF/DOCX ficam fora do repositório).
- Criação da estrutura de pastas: `src/scenes`, `src/classes`, `assets/images`, `assets/maps`, `assets/audio`.
- `index.html` com Phaser 4.2.1 via CDN e carregamento de `src/main.js` como ES6 Module.
- `src/main.js` com resolução 800x600, `Phaser.Scale.FIT` e Arcade Physics sem gravidade.
- `MenuScene` (título, instruções e botão JOGAR), `GameScene` (mapa de teste com paredes, jogador com WASD/Setas e colisões, drone placeholder a patrulhar) e `GameOverScene` (pontuação e botão Jogar Novamente).

### Problemas
- Ainda não existem sprites, mapas nem lógica de jogo definitiva, pelo que o fluxo de cenas só pode ser testado com dados provisórios.

### Soluções
- Utilização de formas geométricas (retângulos e círculos) como placeholders temporários, com pontuação de teste e tecla ESC para chegar ao ecrã de fim de jogo.

### Decisões
- Usar ES6 Modules e Arcade Physics sem gravidade (vista de cima).
- Fixar a versão do Phaser (4.2.1) no CDN para evitar alterações inesperadas.
- Deixar as classes (`Rescuer`, `SmartDrone`, `Victim`, `HazardFire`, `FogOfWar`, `HUD`) para sessões seguintes, após validar a estrutura base.

### Declaração de Utilização de IA
- **Ferramenta usada:** Claude Code (modelo Sonnet 5.5).
- **Finalidade:** configurar o `.gitignore`, gerar a estrutura de pastas e os ficheiros base em Phaser v4, e redigir esta entrada do diário.
- **Resultado:** estrutura inicial funcional com três cenas e placeholders, pronta a testar no browser.
- **Decisões tomadas:** o código gerado foi revisto e aceite pelo autor; as funcionalidades específicas do jogo serão desenvolvidas de forma incremental.
