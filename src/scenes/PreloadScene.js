// Cena de pré-carregamento: spritesheets, tiles, áudio e animações
const SPRITESHEETS = ['socorrista', 'drone', 'fogo', 'vitima', 'tiles_n1', 'tiles_n2'];
const SONS = ['resgate', 'extintor', 'dano', 'nivel', 'vitoria', 'derrota', 'ambiente'];

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Barra de progresso
    const barra = this.add.rectangle(400, 300, 0, 20, 0x4fd1c5).setOrigin(0, 0.5);
    barra.x = 200;
    this.add.rectangle(400, 300, 404, 24).setStrokeStyle(2, 0xffffff);
    this.add.text(400, 260, 'A carregar...', {
      fontFamily: 'monospace', fontSize: '20px', color: '#e2e8f0'
    }).setOrigin(0.5);
    this.load.on('progress', (valor) => { barra.width = 400 * valor; });

    SPRITESHEETS.forEach((nome) => {
      this.load.spritesheet(nome, `assets/images/${nome}.png`, { frameWidth: 32, frameHeight: 32 });
    });
    SONS.forEach((nome) => this.load.audio(nome, `assets/audio/${nome}.wav`));
  }

  create() {
    // Pixel-art: filtro "nearest" para não desfocar ao ampliar
    SPRITESHEETS.forEach((nome) => {
      this.textures.get(nome).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

    this.criarAnimacao('socorrista-andar', 'socorrista', 8);
    this.criarAnimacao('drone-voar', 'drone', 20);
    this.criarAnimacao('fogo-arder', 'fogo', 8);
    this.criarAnimacao('vitima-acenar', 'vitima', 4);

    this.scene.start('MenuScene');
  }

  criarAnimacao(chave, textura, fps) {
    if (this.anims.exists(chave)) return;
    this.anims.create({
      key: chave,
      frames: this.anims.generateFrameNumbers(textura, { start: 0, end: 3 }),
      frameRate: fps,
      repeat: -1
    });
  }
}
