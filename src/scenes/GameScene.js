// Cena principal do jogo: constrói o nível atual a partir dos dados da grelha
import Rescuer from '../classes/Rescuer.js';
import SmartDrone from '../classes/SmartDrone.js';
import Victim from '../classes/Victim.js';
import HazardFire from '../classes/HazardFire.js';
import HUD from '../classes/HUD.js';
import FogOfWar from '../classes/FogOfWar.js';
import { NIVEIS, TAM_TILE } from '../data/levels.js';

// Converte [coluna, linha] no centro do tile em píxeis
const centro = ([c, l]) => ({ x: c * TAM_TILE + TAM_TILE / 2, y: l * TAM_TILE + TAM_TILE / 2 });

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  // Dados recebidos entre níveis: nível atual, pontuação e vítimas salvas acumuladas
  init(dados) {
    this.indiceNivel = dados && dados.nivel ? dados.nivel - 1 : 0;
    this.pontuacao = dados && dados.pontuacao ? dados.pontuacao : 0;
    this.salvasAnteriores = dados && dados.salvasTotal ? dados.salvasTotal : 0;
  }

  create() {
    this.nivel = NIVEIS[this.indiceNivel];
    this.terminado = false;
    this.salvasNivel = 0;
    this.totalGlobal = NIVEIS.reduce((soma, n) => soma + n.vitimas.length, 0);

    this.construirParedes();

    this.vitimas = this.nivel.vitimas.map((p) => {
      const { x, y } = centro(p);
      return new Victim(this, x, y);
    });
    this.totalNivel = this.vitimas.length;
    this.fogos = this.nivel.fogos.map((p) => {
      const { x, y } = centro(p);
      const fogo = new HazardFire(this, x, y);
      fogo.dano = this.nivel.danoFogo;
      return fogo;
    });

    // O jogador começa cada nível com a saúde e o oxigénio cheios
    const inicio = centro(this.nivel.jogador);
    this.jogador = new Rescuer(this, inicio.x, inicio.y);
    this.physics.add.collider(this.jogador, this.paredes);

    // O drone voa, por isso não colide com as paredes
    const posDrone = centro(this.nivel.drone);
    this.drone = new SmartDrone(this, posDrone.x, posDrone.y,
      this.nivel.patrulha.map((p) => new Phaser.Math.Vector2(centro(p).x, centro(p).y)));

    // Nevoeiro (profundidade 50/51) por cima do mapa e abaixo do HUD (100+)
    this.nevoeiro = new FogOfWar(this, 800, 600, 50);
    this.hud = new HUD(this);
    this.input.keyboard.once('keydown-ESC', () => this.terminar(false));

    this.mostrarAviso(`Nível ${this.nivel.id}: ${this.nivel.nome}`, 2200);
  }

  // Cria as paredes agrupando tiles consecutivos de cada linha num só retângulo
  construirParedes() {
    this.paredes = this.physics.add.staticGroup();
    this.nivel.mapa.forEach((linha, l) => {
      let c = 0;
      while (c < linha.length) {
        if (linha[c] !== '#') { c++; continue; }
        let fim = c;
        while (fim < linha.length && linha[fim] === '#') fim++;
        const largura = (fim - c) * TAM_TILE;
        const parede = this.add.rectangle(
          c * TAM_TILE + largura / 2, l * TAM_TILE + TAM_TILE / 2, largura, TAM_TILE, 0x4a5568
        ).setStrokeStyle(1, 0x2d3748);
        this.physics.add.existing(parede, true);
        this.paredes.add(parede);
        c = fim;
      }
    });
  }

  // Mensagem temporária ao centro do ecrã (acima do nevoeiro e do HUD)
  mostrarAviso(texto, duracao) {
    const aviso = this.add.text(400, 300, texto, {
      fontFamily: 'monospace', fontSize: '26px', color: '#ffffff', align: 'center',
      backgroundColor: '#000000cc', padding: { x: 16, y: 10 }
    }).setOrigin(0.5).setDepth(200);
    this.tweens.add({
      targets: aviso, alpha: 0, delay: duracao, duration: 500, onComplete: () => aviso.destroy()
    });
    return aviso;
  }

  update(tempo, delta) {
    if (this.terminado) return;

    this.jogador.atualizar(tempo, delta);
    this.drone.atualizar(tempo, delta, this.jogador, this.fogos);

    // Fusão sensorial: visão do socorrista + telemetria do drone
    this.nevoeiro.atualizar(this.jogador, this.drone);

    // Resgatar vítimas (tecla E)
    this.pontuacao += this.jogador.tentarResgatar(this.vitimas);
    this.vitimas = this.vitimas.filter((v) => v.active);
    this.fogos = this.fogos.filter((f) => f.active);
    this.salvasNivel = this.totalNivel - this.vitimas.length;

    // Dano ao tocar num foco de incêndio
    this.fogos.forEach((fogo) => {
      const dist = Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y, fogo.x, fogo.y);
      if (dist < 14 + 20 * fogo.scaleX) this.jogador.receberDano(fogo.dano, tempo);
    });

    this.hud.atualizar({
      pontos: this.pontuacao,
      salvas: this.salvasNivel,
      restantes: this.vitimas.length,
      saude: this.jogador.saude,
      oxigenio: this.jogador.oxigenio,
      estadoDrone: this.drone.estado,
      nivel: `Nível ${this.nivel.id}: ${this.nivel.nomeCurto}`
    });

    if (this.jogador.estaMorto()) this.terminar(false);
    else if (this.vitimas.length === 0) this.concluirNivel();
  }

  // Todas as vítimas salvas: avança de nível ou termina com vitória
  concluirNivel() {
    if (this.indiceNivel + 1 >= NIVEIS.length) {
      this.terminar(true);
      return;
    }
    this.terminado = true;
    this.jogador.body.setVelocity(0, 0);
    this.drone.body.setVelocity(0, 0);
    this.mostrarAviso(`Setor Limpo!\nA avançar para o Nível ${this.nivel.id + 1}...`, 1800);
    this.time.delayedCall(2300, () => {
      this.scene.restart({
        nivel: this.nivel.id + 1,
        pontuacao: this.pontuacao,
        salvasTotal: this.salvasAnteriores + this.salvasNivel
      });
    });
  }

  terminar(vitoria) {
    if (this.terminado) return;
    this.terminado = true;
    this.scene.start('GameOverScene', {
      vitoria,
      pontuacao: this.pontuacao,
      salvas: this.salvasAnteriores + this.salvasNivel,
      total: this.totalGlobal
    });
  }
}
