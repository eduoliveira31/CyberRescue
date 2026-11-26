// Cena de fim de jogo (vitória ou derrota)
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(dados) {
    this.vitoria = !!(dados && dados.vitoria);
    this.pontuacao = dados && dados.pontuacao ? dados.pontuacao : 0;
    this.salvas = dados && dados.salvas ? dados.salvas : 0;
    this.total = dados && dados.total ? dados.total : 0;
  }

  create() {
    const largura = this.scale.width;
    const titulo = this.vitoria ? 'MISSÃO CONCLUÍDA' : 'FALHA NA MISSÃO';
    const cor = this.vitoria ? '#68d391' : '#fc8181';

    this.add.text(largura / 2, 140, titulo, {
      fontFamily: 'monospace', fontSize: '52px', color: cor
    }).setOrigin(0.5);

    this.add.text(largura / 2, 260, [
      `Pontuação final: ${this.pontuacao}`,
      `Vítimas salvas: ${this.salvas} / ${this.total}`
    ], {
      fontFamily: 'monospace', fontSize: '30px', color: '#e2e8f0', align: 'center', lineSpacing: 12
    }).setOrigin(0.5);

    const botao = this.add.rectangle(largura / 2, 440, 320, 60, 0x2f855a)
      .setStrokeStyle(3, 0x9ae6b4)
      .setInteractive({ useHandCursor: true });
    this.add.text(largura / 2, 440, 'JOGAR NOVAMENTE', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff'
    }).setOrigin(0.5);

    // Reinicia sempre no Nível 1, com a pontuação a zero
    const reiniciar = () => this.scene.start('GameScene', { nivel: 1, pontuacao: 0, salvasTotal: 0 });
    botao.on('pointerover', () => botao.setFillStyle(0x38a169));
    botao.on('pointerout', () => botao.setFillStyle(0x2f855a));
    botao.on('pointerdown', reiniciar);
    this.input.keyboard.once('keydown-ENTER', reiniciar);
  }
}
