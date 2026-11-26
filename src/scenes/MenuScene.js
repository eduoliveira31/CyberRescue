// Cena do menu inicial
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const largura = this.scale.width;

    this.add.text(largura / 2, 90, 'CYBER-RESCUE', {
      fontFamily: 'monospace', fontSize: '56px', color: '#4fd1c5'
    }).setOrigin(0.5);

    const instrucoes = [
      'CONTROLOS',
      'WASD / Setas: mover o socorrista',
      'ESC: terminar a missão',
      '',
      'DRONE INTELIGENTE',
      'O drone patrulha a zona e partilha telemetria',
      'contigo. Trabalhem em equipa para salvar as vítimas!'
    ];
    this.add.text(largura / 2, 280, instrucoes, {
      fontFamily: 'monospace', fontSize: '18px', color: '#e2e8f0', align: 'center', lineSpacing: 8
    }).setOrigin(0.5);

    const botao = this.add.rectangle(largura / 2, 500, 220, 60, 0x2f855a)
      .setStrokeStyle(3, 0x9ae6b4)
      .setInteractive({ useHandCursor: true });
    this.add.text(largura / 2, 500, 'JOGAR', {
      fontFamily: 'monospace', fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    botao.on('pointerover', () => botao.setFillStyle(0x38a169));
    botao.on('pointerout', () => botao.setFillStyle(0x2f855a));
    botao.on('pointerdown', () => this.scene.start('GameScene'));

    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene'));
  }
}
