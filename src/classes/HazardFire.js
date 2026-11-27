const ESCALA_BASE = 1.3;

// Foco de incêndio (chamas animadas) que fere o jogador e pode ser extinto pelo drone
export default class HazardFire extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fogo', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setScale(ESCALA_BASE);
    this.anims.play('fogo-arder');

    this.intensidade = 100; // chega a 0 quando o fogo é apagado
    this.dano = 10;
    this.etiqueta = scene.add.text(x, y - 32, 'FOGO', {
      fontFamily: 'monospace', fontSize: '11px', color: '#fbd38d'
    }).setOrigin(0.5).setDepth(5);
  }

  // Reduz a intensidade; devolve true se o fogo ficou extinto
  apagar(quantidade) {
    this.intensidade -= quantidade;
    this.setScale(ESCALA_BASE * Math.max(0.2, this.intensidade / 100));
    if (this.intensidade <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  // Raio de perigo (em píxeis) que diminui à medida que o fogo é apagado
  get raio() {
    return 20 * Math.max(0.2, this.intensidade / 100);
  }

  destroy(fromScene) {
    if (this.etiqueta) this.etiqueta.destroy();
    super.destroy(fromScene);
  }
}
