// Foco de incêndio (placeholder: círculo laranja) que fere o jogador e pode ser extinto pelo drone
export default class HazardFire extends Phaser.GameObjects.Arc {
  constructor(scene, x, y) {
    super(scene, x, y, 20, 0, 360, false, 0xed8936);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.intensidade = 100; // chega a 0 quando o fogo é apagado
    this.dano = 10;
    this.etiqueta = scene.add.text(x, y - 30, 'FOGO', {
      fontFamily: 'monospace', fontSize: '11px', color: '#fbd38d'
    }).setOrigin(0.5).setDepth(5);
  }

  // Reduz a intensidade; devolve true se o fogo ficou extinto
  apagar(quantidade) {
    this.intensidade -= quantidade;
    this.setScale(Math.max(0.2, this.intensidade / 100));
    if (this.intensidade <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  destroy(fromScene) {
    if (this.etiqueta) this.etiqueta.destroy();
    super.destroy(fromScene);
  }
}
