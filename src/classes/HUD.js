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
    this.textoMeio = scene.add.text(480, 6, '', estilo).setDepth(101);
    this.textoDrone = scene.add.text(12, 24, '', estilo).setDepth(101);
    this.textoAjuda = scene.add.text(788, 24, 'E: resgatar  F: chamar drone', {
      ...estilo, fontSize: '12px', color: '#a0aec0'
    }).setOrigin(1, 0).setDepth(101);
  }

  atualizar({ pontos, salvas, restantes, saude, oxigenio, estadoDrone }) {
    this.textoEsq.setText(`Pontos: ${pontos}  Vítimas: ${salvas} salvas / ${restantes} restantes`);
    this.textoMeio.setText(`Saúde: ${Math.ceil(saude)}  Oxigénio: ${Math.ceil(oxigenio)}`);
    this.textoDrone.setText(`Drone: ${estadoDrone}`).setColor(COR_ESTADO[estadoDrone] || '#ffffff');
  }
}
