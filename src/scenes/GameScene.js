// Cena principal do jogo (mapa de teste com placeholders)
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.pontuacao = 0;

    // Paredes (retângulos estáticos): bordas e alguns obstáculos
    this.paredes = this.physics.add.staticGroup();
    const blocos = [
      [400, 10, 800, 20], [400, 590, 800, 20], [10, 300, 20, 600], [790, 300, 20, 600],
      [250, 200, 20, 240], [550, 400, 20, 240], [400, 300, 160, 20]
    ];
    blocos.forEach(([x, y, w, h]) => {
      const parede = this.add.rectangle(x, y, w, h, 0x4a5568);
      this.physics.add.existing(parede, true);
      this.paredes.add(parede);
    });

    // Jogador (placeholder: quadrado azul)
    this.jogador = this.add.rectangle(80, 520, 28, 28, 0x4299e1);
    this.physics.add.existing(this.jogador);
    this.jogador.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.jogador, this.paredes);

    // Drone (placeholder: círculo ciano) que patrulha entre pontos
    this.drone = this.add.circle(120, 80, 14, 0x4fd1c5);
    this.physics.add.existing(this.drone);
    this.pontosPatrulha = [
      new Phaser.Math.Vector2(120, 80),
      new Phaser.Math.Vector2(680, 80),
      new Phaser.Math.Vector2(680, 500),
      new Phaser.Math.Vector2(120, 500)
    ];
    this.indicePatrulha = 1;

    // Controlos
    this.cursores = this.input.keyboard.createCursorKeys();
    this.teclas = this.input.keyboard.addKeys('W,A,S,D');
    this.input.keyboard.once('keydown-ESC', () => this.terminar());

    this.textoHUD = this.add.text(30, 28, '', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff'
    }).setDepth(10);

    // Pontuação de teste: +10 por segundo
    this.time.addEvent({ delay: 1000, loop: true, callback: () => { this.pontuacao += 10; } });
  }

  update() {
    // Movimento do jogador (normalizado para não andar mais depressa na diagonal)
    const velocidade = 200;
    let vx = 0;
    let vy = 0;
    if (this.cursores.left.isDown || this.teclas.A.isDown) vx = -1;
    else if (this.cursores.right.isDown || this.teclas.D.isDown) vx = 1;
    if (this.cursores.up.isDown || this.teclas.W.isDown) vy = -1;
    else if (this.cursores.down.isDown || this.teclas.S.isDown) vy = 1;
    const direcao = new Phaser.Math.Vector2(vx, vy).normalize().scale(velocidade);
    this.jogador.body.setVelocity(direcao.x, direcao.y);

    // Patrulha do drone
    const alvo = this.pontosPatrulha[this.indicePatrulha];
    if (Phaser.Math.Distance.Between(this.drone.x, this.drone.y, alvo.x, alvo.y) < 6) {
      this.indicePatrulha = (this.indicePatrulha + 1) % this.pontosPatrulha.length;
    } else {
      this.physics.moveTo(this.drone, alvo.x, alvo.y, 120);
    }

    this.textoHUD.setText(`Pontos: ${this.pontuacao}  |  Drone: PATROL  |  ESC: terminar`);
  }

  terminar() {
    this.scene.start('GameOverScene', { pontuacao: this.pontuacao });
  }
}
