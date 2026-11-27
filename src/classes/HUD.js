// Interface fixa no topo do ecrã
const COR_ESTADO = {
  PATROL: '#4fd1c5',
  EXTINGUISH: '#ed8936',
  ASSIST: '#b794f4'
};

export default class HUD {
  constructor(scene) {
    const estilo = { fontFamily: 'monospace', fontSize: '15px', color: '#ffffff' };

    this.fundo = scene.add.rectangle(400, 22, 800, 44, 0x000000, 0.75).setDepth(100);
    this.textoEsq = scene.add.text(12, 6, '', estilo).setDepth(101);
    this.textoMeio = scene.add.text(420, 6, '', estilo).setDepth(101);
    this.textoDrone = scene.add.text(12, 24, '', estilo).setDepth(101);
    this.textoNivel = scene.add.text(190, 24, '', { ...estilo, color: '#faf089' }).setDepth(101);
    // Botão de som (clicável ou tecla M)
    this.cena = scene;
    this.textoSom = scene.add.text(788, 6, '', { ...estilo, fontSize: '14px' })
      .setOrigin(1, 0).setDepth(101).setInteractive({ useHandCursor: true });
    this.textoSom.on('pointerdown', () => this.alternarSom());
    scene.input.keyboard.on('keydown-M', () => this.alternarSom());
    this.mostrarEstadoSom();

    this.textoAjuda = scene.add.text(788, 24, 'E: resgatar  F: chamar drone', {
      ...estilo, fontSize: '12px', color: '#a0aec0'
    }).setOrigin(1, 0).setDepth(101);
  }

  // Silencia ou ativa todo o som do Phaser
  alternarSom() {
    this.cena.sound.mute = !this.cena.sound.mute;
    this.mostrarEstadoSom();
  }

  mostrarEstadoSom() {
    const ligado = !this.cena.sound.mute;
    this.textoSom.setText(ligado ? 'Som ON [M]' : 'Som OFF [M]')
      .setColor(ligado ? '#68d391' : '#fc8181');
  }

  atualizar({ pontos, salvas, restantes, saude, oxigenio, estadoDrone, nivel }) {
    this.textoNivel.setText(nivel || '');
    this.textoEsq.setText(`Pontos: ${pontos}  Vítimas: ${salvas} salvas / ${restantes} restantes`);
    this.textoMeio.setText(`Saúde: ${Math.ceil(saude)}  Oxigénio: ${Math.ceil(oxigenio)}`);
    this.textoDrone.setText(`Drone: ${estadoDrone}`).setColor(COR_ESTADO[estadoDrone] || '#ffffff');
  }
}
