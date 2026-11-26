// Fusão Sensorial: nevoeiro de guerra com visão do socorrista e telemetria partilhada do drone
export default class FogOfWar {
  constructor(scene, largura, altura, profundidade = 50) {
    this.scene = scene;
    this.raioSocorrista = 110; // visão humana direta
    this.raioDrone = 160;      // telemetria partilhada pelo drone
    this.opacidadeMemoria = 0.55; // sombra nas áreas já visitadas

    this.criarTexturaLuz();
    // Imagens usadas só como "borracha" (nunca são adicionadas à cena).
    // Uma por fonte de visão: o Phaser v4 guarda a referência do objeto e só lê
    // posição/escala em render(), por isso partilhar uma imagem fazia todos os
    // círculos aparecerem na última posição (a do drone)
    this.borrachaSocorrista = this.criarBorracha(this.raioSocorrista);
    this.borrachaDrone = this.criarBorracha(this.raioDrone);

    // Camada 1: nevoeiro permanente. Começa totalmente preto e vai sendo apagado
    // nas zonas exploradas, que ficam a descoberto para sempre
    this.camadaOculta = scene.add.renderTexture(0, 0, largura, altura)
      .setOrigin(0, 0).setDepth(profundidade);
    this.camadaOculta.fill(0x000000, 1);
    this.camadaOculta.render();

    // Camada 2: sombra de memória, redesenhada a cada frame; só fica limpa
    // dentro das zonas que estão a ser vistas neste momento
    this.camadaMemoria = scene.add.renderTexture(0, 0, largura, altura)
      .setOrigin(0, 0).setDepth(profundidade + 1);
  }

  // Gera um círculo com bordas suaves (gradiente radial) para usar como borracha
  criarTexturaLuz() {
    if (this.scene.textures.exists('luz')) return;
    const tamanho = 256;
    const tela = this.scene.textures.createCanvas('luz', tamanho, tamanho);
    const ctx = tela.getContext();
    const meio = tamanho / 2;
    const gradiente = ctx.createRadialGradient(meio, meio, meio * 0.55, meio, meio, meio);
    gradiente.addColorStop(0, 'rgba(255,255,255,1)');
    gradiente.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, tamanho, tamanho);
    tela.refresh();
  }

  criarBorracha(raio) {
    return new Phaser.GameObjects.Image(this.scene, 0, 0, 'luz').setScale((raio * 2) / 256);
  }

  // Apaga um círculo de nevoeiro numa camada; a posição vai no próprio comando
  apagarCirculo(camada, borracha, x, y) {
    camada.erase(borracha, x, y);
  }

  // Chamar a cada frame com as fontes de visão
  atualizar(socorrista, drone) {
    const fontes = [
      [this.borrachaSocorrista, socorrista.x, socorrista.y],
      [this.borrachaDrone, drone.x, drone.y]
    ];

    // Explora permanentemente (zonas já visitadas deixam de estar ocultas)
    fontes.forEach(([b, x, y]) => this.apagarCirculo(this.camadaOculta, b, x, y));
    this.camadaOculta.render();

    // Sombra de memória com buracos onde se vê em tempo real
    this.camadaMemoria.clear();
    this.camadaMemoria.fill(0x000000, this.opacidadeMemoria);
    fontes.forEach(([b, x, y]) => this.apagarCirculo(this.camadaMemoria, b, x, y));
    this.camadaMemoria.render();
  }

  // Indica se um ponto está dentro de uma zona atualmente visível
  estaVisivel(x, y, socorrista, drone) {
    return Phaser.Math.Distance.Between(x, y, socorrista.x, socorrista.y) <= this.raioSocorrista
      || Phaser.Math.Distance.Between(x, y, drone.x, drone.y) <= this.raioDrone;
  }
}
