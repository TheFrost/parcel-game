import SketchPlayer from './sketch.player';
import SketchUI from './sketch.ui';
import PubSub from './pubsub';

export default class GameApp {
  constructor(config = {}) {
    this.config = config;
    this.pubsub = new PubSub();

    // flags
    this.gameOver = false;
  }

  init(scoreMultiplier) {
    this.sketchPlayer = new SketchPlayer(
      this.config.gameWidth,
      this.config.gameHeight,
      this.config.player
    );
    
    this.sketchUi = new SketchUI(
      this.config.gameWidth,
      this.config.gameHeight,
      this.config.ui,
      scoreMultiplier
    );
    
    this.bindEvents();
    this.draw();
  }

  bindEvents() {
    this.pubsub.suscribe('gameOver', this.stopDraw, this);
  }

  draw() {
    if (this.gameOver) return;

    this.requestId = window.requestAnimationFrame(this.draw.bind(this));

    if (this.sketchPlayer.isReady && this.sketchUi.isReady) {
      this.sketchPlayer.draw();
      this.sketchUi.draw();
    }
  }

  stopDraw() {
    this.gameOver = true;
    window.cancelAnimationFrame(this.requestId);
  }
}