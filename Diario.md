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

## Sessão 2 — 26 de novembro de 2026

### Objetivo
Implementar o núcleo da jogabilidade cooperativa entre o socorrista e o drone inteligente, ainda com formas geométricas e etiquetas visuais.

### Atividades realizadas
- `Rescuer`: movimento com WASD/Setas, saúde e oxigénio (100), tecla E para resgatar vítimas próximas e tecla F para chamar o drone.
- `SmartDrone`: Máquina de Estados Finitos com PATROL, EXTINGUISH e ASSIST, com o estado visível acima do drone.
- `Victim` (+100 pontos ao ser resgatada) e `HazardFire` (causa dano ao toque e pode ser extinto pelo drone).
- `HUD` fixo no topo com pontuação, vítimas salvas/restantes, saúde, oxigénio e estado do drone.
- `GameScene` atualizada com paredes, 5 vítimas e 5 focos de fogo; o jogo termina ao salvar todas as vítimas ou se a saúde chegar a 0.

### Problemas
- O drone tinha de decidir entre patrulhar, apagar fogos e ajudar o jogador sem comportamentos contraditórios.

### Soluções
- Prioridade fixa nas transições: ASSIST (tecla F ou saúde abaixo de 40) > EXTINGUISH (fogo no raio de deteção) > PATROL. Em ASSIST o drone também apaga fogos junto ao jogador e recarrega-lhe oxigénio e saúde.

### Decisões
- O drone voa, por isso não colide com as paredes.
- O oxigénio desce lentamente e, a zero, a saúde começa a descer.
- Os valores (raios, danos, velocidades) são provisórios e serão afinados nos testes.

### Declaração de Utilização de IA
- **Ferramenta usada:** Claude Code (modelo Sonnet 5.5).
- **Finalidade:** gerar as classes `Rescuer`, `SmartDrone`, `Victim`, `HazardFire` e `HUD` e integrá-las na `GameScene`.
- **Resultado:** mecânica cooperativa jogável com placeholders, a testar no browser.
- **Decisões tomadas:** o código foi revisto pelo autor; a FSM e os parâmetros serão ajustados após testes.

## Sessão 3 — 26 de novembro de 2026

### Objetivo
Implementar a Fusão Sensorial (Fog of War com telemetria partilhada pelo drone).

### Atividades realizadas
- Criação de `FogOfWar`: duas camadas de `RenderTexture` por cima do mapa e abaixo do HUD. A primeira é um nevoeiro permanente, apagado nas zonas exploradas. A segunda é uma sombra de memória, que só fica limpa onde se vê em tempo real.
- Dois raios de visão: socorrista (110 px, visão direta) e drone (160 px, telemetria partilhada), com bordas suaves.
- Integração na `GameScene`, com o HUD sempre por cima.

### Problemas
- No Phaser v4 as operações de desenho em texturas ficam em memória e só aparecem após `render()`.

### Soluções
- Consulta do código-fonte do Phaser 4.2.1 e chamada explícita de `render()` a cada frame.

### Decisões
- Zonas nunca exploradas ficam totalmente ocultas; as visitadas ficam sombreadas (55%).
- Os raios são provisórios e serão afinados nos testes.

### Declaração de Utilização de IA
- **Ferramenta usada:** Claude Code (modelo Sonnet 5.5).
- **Finalidade:** gerar a classe `FogOfWar` e integrá-la na `GameScene`.
- **Resultado:** nevoeiro com visão partilhada, por testar no browser.
- **Decisões tomadas:** o código foi revisto pelo autor; valores a ajustar após testes.

## Sessão 4 — 26 de novembro de 2026

### Objetivo
Corrigir a visibilidade do Fog of War: o campo de visão do socorrista não acompanhava o jogador.

### Atividades realizadas
- Diagnóstico: o Phaser v4 guarda o comando de desenho com a referência do objeto e só lê posição e escala em `render()`. Como se reutilizava a mesma "borracha" para os dois círculos, ambos eram desenhados na última posição (a do drone).
- Correção em `FogOfWar`: uma borracha por fonte de visão (socorrista e drone), com a posição passada no próprio comando `erase`.
- A camada de memória continua a ser redesenhada a cada frame; só fica limpa dentro dos raios atuais, com sombra nas zonas já visitadas.

### Problemas
- Dois círculos de visão a partilharem o mesmo objeto temporário.

### Soluções
- Objetos independentes por fonte e coordenadas explícitas em cada `erase`.

### Decisões
- Manter a memória do mapa (zonas visitadas ficam sombreadas) em vez de voltarem a ficar totalmente ocultas.

### Declaração de Utilização de IA
- **Ferramenta usada:** Claude Code (modelo Sonnet 5.5).
- **Finalidade:** diagnosticar o erro a partir do código-fonte do Phaser 4.2.1 e corrigir `FogOfWar`.
- **Resultado:** correção aplicada, validada só por análise do código e verificação de sintaxe; falta confirmar no browser.
- **Decisões tomadas:** correção revista pelo autor.

## Sessão 5 — 26 de novembro de 2026

### Objetivo
Criar dois níveis em grelha inspirados em Viana do Castelo e a progressão completa do jogo.

### Atividades realizadas
- `src/data/levels.js` com dois mapas 20x15 (tiles de 40 px): Nível 1 "ESTG - IPVC" (salas, corredores e átrio; 3 vítimas, 3 fogos) e Nível 2 "Centro Histórico / Praça da República" (quarteirões, vielas estreitas e praça central; 5 vítimas, 6 fogos, dano maior).
- `GameScene` constrói paredes, jogador, drone, vítimas e fogos a partir dos dados; ao salvar todas as vítimas do Nível 1 mostra "Setor Limpo!" e avança para o Nível 2 mantendo a pontuação.
- `HUD` mostra o nível atual; `GameOverScene` mostra "MISSÃO CONCLUÍDA" ou "FALHA NA MISSÃO", pontuação, vítimas salvas e reinício no Nível 1.

### Problemas
- Garantir que todas as posições de vítimas e fogos são acessíveis e não ficam dentro de paredes.

### Soluções
- Script de validação (fora do repositório) que confirma dimensões, células livres e acessibilidade por flood fill nos dois mapas.

### Decisões
- Paredes agrupadas por linha para reduzir o número de corpos físicos.
- O socorrista começa cada nível com saúde e oxigénio cheios.
- Os layouts são inspirados nos locais, não plantas fiéis.

### Declaração de Utilização de IA
- **Ferramenta usada:** Claude Code (modelo Sonnet 5.5).
- **Finalidade:** desenhar os layouts, implementar a progressão de níveis e atualizar o HUD e a GameOverScene.
- **Resultado:** dois níveis jogáveis com vitória e derrota, ainda por testar no browser.
- **Decisões tomadas:** código revisto pelo autor; dificuldade a ajustar após testes.
