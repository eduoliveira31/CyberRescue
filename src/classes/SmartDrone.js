// Drone autónomo com Máquina de Estados Finitos (PATROL, EXTINGUISH, ASSIST)
export const ESTADOS = {
  PATROL: 'PATROL',
  EXTINGUISH: 'EXTINGUISH',
  ASSIST: 'ASSIST'
};

// Cor aplicada ao sprite conforme o estado
const CORES = {
  PATROL: 0xffffff,
  EXTINGUISH: 0xffb27a,
  ASSIST: 0xc9a8ff
};

export default class SmartDrone extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, pontosPatrulha) {
    super(scene, x, y, 'drone', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.anims.play('drone-voar');
    this.setDepth(10);
    this.proximoSomExtintor = 0;
    this.tempoAtual = 0;

    this.estado = ESTADOS.PATROL;
    this.pontosPatrulha = pontosPatrulha;
    this.indicePatrulha = 0;
    this.velocidade = 130;
    this.raioDeteccao = 260;     // distância a que deteta focos de incêndio
    this.raioProtecao = 90;      // fogos próximos do jogador também são apagados
    this.limiteSaudeBaixa = 40;  // abaixo disto o drone vai assistir sozinho
    this.duracaoChamada = 6000;  // quanto tempo dura o ASSIST após tecla F
    this.assistAte = 0;
    this.alvoFogo = null;

    this.etiqueta = scene.add.text(x, y - 28, this.estado, {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
      backgroundColor: '#000000a0', padding: { x: 3, y: 1 }
    }).setOrigin(0.5).setDepth(15);
  }

  // Ciclo principal: decidir o estado e executar o comportamento
  atualizar(tempo, delta, jogador, fogos) {
    this.tempoAtual = tempo;
    if (jogador.pedidoAjuda) {
      jogador.pedidoAjuda = false;
      this.assistAte = tempo + this.duracaoChamada;
    }

    this.mudarEstado(this.decidirEstado(tempo, jogador, fogos));

    switch (this.estado) {
      case ESTADOS.ASSIST:
        this.executarAssist(delta, jogador, fogos);
        break;
      case ESTADOS.EXTINGUISH:
        this.executarExtinguish(delta);
        break;
      default:
        this.executarPatrol();
    }

    this.etiqueta.setPosition(this.x, this.y - 28);
  }

  // Prioridade das transições: ASSIST > EXTINGUISH > PATROL
  decidirEstado(tempo, jogador, fogos) {
    if (tempo < this.assistAte || jogador.saude < this.limiteSaudeBaixa) {
      return ESTADOS.ASSIST;
    }
    this.alvoFogo = this.fogoMaisPerto(this, fogos, this.raioDeteccao);
    return this.alvoFogo ? ESTADOS.EXTINGUISH : ESTADOS.PATROL;
  }

  mudarEstado(novo) {
    if (novo === this.estado) return;
    this.estado = novo;
    this.setTint(CORES[novo]);
    this.etiqueta.setText(novo);
  }

  executarPatrol() {
    const alvo = this.pontosPatrulha[this.indicePatrulha];
    if (Phaser.Math.Distance.Between(this.x, this.y, alvo.x, alvo.y) < 8) {
      this.indicePatrulha = (this.indicePatrulha + 1) % this.pontosPatrulha.length;
    } else {
      this.irPara(alvo.x, alvo.y);
    }
  }

  executarExtinguish(delta) {
    const fogo = this.alvoFogo;
    if (!fogo || !fogo.active) return;
    if (Phaser.Math.Distance.Between(this.x, this.y, fogo.x, fogo.y) > 40) {
      this.irPara(fogo.x, fogo.y);
    } else {
      this.body.setVelocity(0, 0);
      fogo.apagar(40 * delta / 1000);
      this.tocarExtintor();
    }
  }

  // Acompanha o jogador, apaga fogos próximos e recarrega-lhe o oxigénio
  executarAssist(delta, jogador, fogos) {
    const segundos = delta / 1000;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, jogador.x, jogador.y);
    if (dist > 50) {
      this.irPara(jogador.x, jogador.y);
    } else {
      this.body.setVelocity(0, 0);
      jogador.oxigenio = Math.min(100, jogador.oxigenio + 15 * segundos);
      jogador.saude = Math.min(100, jogador.saude + 4 * segundos);
    }
    const perigo = this.fogoMaisPerto(jogador, fogos, this.raioProtecao);
    if (perigo) {
      perigo.apagar(40 * segundos);
      this.tocarExtintor();
    }
  }

  // Som do extintor, repetido a cada 350 ms enquanto está a apagar
  tocarExtintor() {
    if (this.tempoAtual < this.proximoSomExtintor) return;
    this.scene.sound.play('extintor', { volume: 0.5 });
    this.proximoSomExtintor = this.tempoAtual + 350;
  }

  fogoMaisPerto(origem, fogos, raio) {
    let melhor = null;
    let melhorDist = raio;
    fogos.forEach((f) => {
      const d = Phaser.Math.Distance.Between(origem.x, origem.y, f.x, f.y);
      if (f.active && d <= melhorDist) {
        melhorDist = d;
        melhor = f;
      }
    });
    return melhor;
  }

  irPara(x, y) {
    this.scene.physics.moveTo(this, x, y, this.velocidade);
  }

  destroy(fromScene) {
    if (this.etiqueta) this.etiqueta.destroy();
    super.destroy(fromScene);
  }
}
