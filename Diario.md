# Diário de Desenvolvimento — Cyber-Rescue

## Sessão 2 — 26 de novembro de 2026

### Objetivo
Configurar as regras do projeto para o assistente de IA e garantir que o ficheiro `CLAUDE.md` nunca é enviado para o GitHub.

### Atividades realizadas
- Criação do `.gitignore` para manter ficheiros locais fora do repositório.
- Criação do ficheiro local de regras do projeto com a arquitetura técnica (Phaser v4, ES6 Modules, Arcade Physics sem gravidade), o tema (Fusão Sensorial / Fog of War e Autonomia Partilhada com FSM PATROL, EXTINGUISH, ASSIST), as cenas obrigatórias, as classes modulares em `src/classes/` e o fluxo de trabalho.

### Problemas
- O `Diario.md` estava vazio no diretório de trabalho (a versão commitada continha apenas um carácter solto), pelo que não havia estrutura anterior para replicar.

### Soluções
- Foi definida uma estrutura base (Data, Objetivo, Atividades, Problemas, Soluções, Decisões, Declaração de Utilização de IA) a seguir nas sessões futuras.

### Decisões
- Manter o ficheiro de regras apenas local, ignorado pelo Git.
- Usar o nome de ficheiro existente `Diario.md`.

### Declaração de Utilização de IA
- **Ferramenta usada:** Claude Code (modelo Sonnet 5.5).
- **Finalidade:** criar o `.gitignore`, o ficheiro local de regras e esta entrada do diário.
- **Resultado:** ficheiros criados conforme as instruções fornecidas.
- **Decisões tomadas:** o conteúdo foi revisto e aceite pelo autor; a estrutura do diário foi definida de raiz por não existir histórico utilizável.
