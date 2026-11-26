// Vítima a resgatar (placeholder: círculo amarelo)
export default class Victim extends Phaser.GameObjects.Arc {
  constructor(scene, x, y) {
    super(scene, x, y, 12, 0, 360, false, 0xf6e05e);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.pontos = 100;
    this.etiqueta = scene.add.text(x, y - 22, 'VÍTIMA [E]', {
      fontFamily: 'monospace', fontSize: '11px', color: '#faf089'
    }).setOrigin(0.5).setDepth(5);
  }

  // Devolve os pontos ganhos e remove a vítima do mapa
  resgatar() {
    const scene = this.scene;
    const aviso = scene.add.text(this.x, this.y - 10, `+${this.pontos}`, {
      fontFamily: 'monospace', fontSize: '20px', color: '#68d391'
    }).setOrigin(0.5).setDepth(20);
    scene.tweens.add({
      targets: aviso, y: this.y - 50, alpha: 0, duration: 800, onComplete: () => aviso.destroy()
    });
    const pontos = this.pontos;
    this.destroy();
    return pontos;
  }

  destroy(fromScene) {
    if (this.etiqueta) this.etiqueta.destroy();
    super.destroy(fromScene);
  }
}
