// Cena de fim de jogo
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(dados) {
    this.pontuacao = dados && dados.pontuacao ? dados.pontuacao : 0;
  }

  create() {
    const largura = this.scale.width;

    this.add.text(largura / 2, 160, 'FIM DE JOGO', {
      fontFamily: 'monospace', fontSize: '52px', color: '#fc8181'
    }).setOrigin(0.5);

    this.add.text(largura / 2, 270, `Pontuação: ${this.pontuacao}`, {
      fontFamily: 'monospace', fontSize: '32px', color: '#e2e8f0'
    }).setOrigin(0.5);

    const botao = this.add.rectangle(largura / 2, 420, 320, 60, 0x2f855a)
      .setStrokeStyle(3, 0x9ae6b4)
      .setInteractive({ useHandCursor: true });
    this.add.text(largura / 2, 420, 'JOGAR NOVAMENTE', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff'
    }).setOrigin(0.5);

    botao.on('pointerover', () => botao.setFillStyle(0x38a169));
    botao.on('pointerout', () => botao.setFillStyle(0x2f855a));
    botao.on('pointerdown', () => this.scene.start('GameScene'));

    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene'));
  }
}
