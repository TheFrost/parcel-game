import Sketch from './sketch';

export default class SketchUI extends Sketch {
  constructor(gameWidth, gameHeight, config, scoreMultiplier = 1) {
    super(gameWidth, gameHeight, config);

    this.timer = config.timeLimit || 60; // in seconds
    this.startTime = Date.now();

    this.score = 0;
    this.finalScore = 0;
    this.scorePerShape = 10;
    this.scoreMultiplier = scoreMultiplier;

    this.init();
  }

  //#region Custom methods
  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.pubsub.suscribe('completedDraw', this.onCompletedDraw, this);
  }

  onCompletedDraw() {
    this.score += this.scorePerShape;
    console.log('score:', this.score);
  }

  getCountDown() {
    let ellapsed = this.p5.floor((Date.now() - this.startTime)/1000);
    return this.timer - ellapsed;
  }

  triggerFinishGame() {
    this.pubsub.publish('gameOver');
    this.p5.noLoop();
    this.finalScore = this.score * this.scoreMultiplier;
    console.log('multiplier:', this.scoreMultiplier);
    console.log('finalScore:', this.finalScore);
  }
  //#endregion Custom methods

  //#region p5.js main methods
  setup() {}

  draw() {
    const p5 = this.p5;

    p5.background(this.sketch.background);

    // format
    p5.fill(255);
    p5.strokeWeight(3);
    p5.stroke(255, 100, 0);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(32);
    p5.textStyle(p5.BOLD);

    // points
    p5.text(this.score, p5.width/2, 50);

    // timer
    let time = this.getCountDown();
    let message = time > 0 ? time + ' sec' : 'GAME OVER';
    p5.text(message, p5.width/2, p5.height*0.9);
    if (time === 0) this.triggerFinishGame();
  }
  //#endregion p5.js main methods
};