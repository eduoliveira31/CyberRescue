// Cena principal do jogo (mapa de teste com placeholders)
import Rescuer from '../classes/Rescuer.js';
import SmartDrone from '../classes/SmartDrone.js';
import Victim from '../classes/Victim.js';
import HazardFire from '../classes/HazardFire.js';
import HUD from '../classes/HUD.js';
import FogOfWar from '../classes/FogOfWar.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.pontuacao = 0;
    this.salvas = 0;
    this.terminado = false;

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

    // Vítimas e focos de fogo (posições de teste)
    this.vitimas = [[120, 300], [400, 150], [650, 200], [400, 450], [680, 500]]
      .map(([x, y]) => new Victim(this, x, y));
    this.fogos = [[200, 470], [400, 380], [620, 150], [460, 100], [150, 200]]
      .map(([x, y]) => new HazardFire(this, x, y));
    this.totalVitimas = this.vitimas.length;

    // Jogador e drone (o drone voa, por isso não colide com paredes)
    this.jogador = new Rescuer(this, 80, 520);
    this.physics.add.collider(this.jogador, this.paredes);
    this.drone = new SmartDrone(this, 120, 60, [
      new Phaser.Math.Vector2(120, 60),
      new Phaser.Math.Vector2(680, 60),
      new Phaser.Math.Vector2(680, 540),
      new Phaser.Math.Vector2(120, 540)
    ]);

    // Nevoeiro (profundidade 50/51) por cima do mapa e abaixo do HUD (100+)
    this.nevoeiro = new FogOfWar(this, 800, 600, 50);
    this.hud = new HUD(this);
    this.input.keyboard.once('keydown-ESC', () => this.terminar());
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
    this.salvas = this.totalVitimas - this.vitimas.length;

    // Dano ao tocar num foco de incêndio
    this.fogos.forEach((fogo) => {
      const dist = Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y, fogo.x, fogo.y);
      if (dist < 14 + 20 * fogo.scaleX) this.jogador.receberDano(fogo.dano, tempo);
    });

    this.hud.atualizar({
      pontos: this.pontuacao,
      salvas: this.salvas,
      restantes: this.vitimas.length,
      saude: this.jogador.saude,
      oxigenio: this.jogador.oxigenio,
      estadoDrone: this.drone.estado
    });

    if (this.jogador.estaMorto() || this.vitimas.length === 0) this.terminar();
  }

  terminar() {
    if (this.terminado) return;
    this.terminado = true;
    this.scene.start('GameOverScene', { pontuacao: this.pontuacao });
  }
}
