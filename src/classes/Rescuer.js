// Socorrista controlado pelo jogador (placeholder: quadrado azul)
export default class Rescuer extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 28, 28, 0x4299e1);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);

    this.saude = 100;
    this.oxigenio = 100;
    this.velocidade = 200;
    this.raioResgate = 50;
    this.pedidoAjuda = false; // marcado quando o jogador prime F
    this.invulneravelAte = 0;

    this.cursores = scene.input.keyboard.createCursorKeys();
    this.teclas = scene.input.keyboard.addKeys('W,A,S,D,E,F');

    this.etiqueta = scene.add.text(x, y - 26, 'SOCORRISTA', {
      fontFamily: 'monospace', fontSize: '11px', color: '#bee3f8'
    }).setOrigin(0.5).setDepth(5);
  }

  // Atualização por frame; devolve nada, os pedidos ficam em flags/métodos
  atualizar(tempo, delta) {
    const esq = this.cursores.left.isDown || this.teclas.A.isDown;
    const dir = this.cursores.right.isDown || this.teclas.D.isDown;
    const cima = this.cursores.up.isDown || this.teclas.W.isDown;
    const baixo = this.cursores.down.isDown || this.teclas.S.isDown;

    // Vetor normalizado para não andar mais depressa na diagonal
    const direcao = new Phaser.Math.Vector2(
      (dir ? 1 : 0) - (esq ? 1 : 0),
      (baixo ? 1 : 0) - (cima ? 1 : 0)
    ).normalize().scale(this.velocidade);
    this.body.setVelocity(direcao.x, direcao.y);

    // O oxigénio gasta-se devagar; sem oxigénio a saúde desce
    const segundos = delta / 1000;
    this.oxigenio = Math.max(0, this.oxigenio - 0.8 * segundos);
    if (this.oxigenio <= 0) this.saude = Math.max(0, this.saude - 3 * segundos);

    if (Phaser.Input.Keyboard.JustDown(this.teclas.F)) this.pedidoAjuda = true;

    // Pisca enquanto está invulnerável após levar dano
    this.setAlpha(tempo < this.invulneravelAte ? 0.5 : 1);
    this.etiqueta.setPosition(this.x, this.y - 26);
  }

  // Tecla E: resgata a vítima mais próxima dentro do raio; devolve os pontos ganhos
  tentarResgatar(vitimas) {
    if (!Phaser.Input.Keyboard.JustDown(this.teclas.E)) return 0;
    let maisPerto = null;
    let melhorDist = this.raioResgate;
    vitimas.forEach((v) => {
      const d = Phaser.Math.Distance.Between(this.x, this.y, v.x, v.y);
      if (v.active && d <= melhorDist) {
        melhorDist = d;
        maisPerto = v;
      }
    });
    return maisPerto ? maisPerto.resgatar() : 0;
  }

  receberDano(quantidade, tempo) {
    if (tempo < this.invulneravelAte) return;
    this.saude = Math.max(0, this.saude - quantidade);
    this.invulneravelAte = tempo + 700;
  }

  estaMorto() {
    return this.saude <= 0;
  }

  destroy(fromScene) {
    if (this.etiqueta) this.etiqueta.destroy();
    super.destroy(fromScene);
  }
}
