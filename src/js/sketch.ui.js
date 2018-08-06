import Sketch from './sketch';
import { pad } from './utils';

export default class SketchUI extends Sketch {
  constructor(gameWidth, gameHeight, config, scoreMultiplier = 1) {
    super(gameWidth, gameHeight, config);

    this.timer = config.timeLimit || 60; // in seconds
    this.startTime = Date.now();

    this.score = 0;
    this.finalScore = 0;
    this.scorePerShape = 10;
    this.scoreMultiplier = scoreMultiplier;

    //flags
    this.isReady = false;

    this.init();
  }

  //#region p5.js main methods
  preload() {
    this.assets = {
      scoreBar: this.p5.loadImage('resources/ui/points-bar.png'),
      bgGame: this.p5.loadImage('resources/ui/bg.jpg')
    }
  }

  setup() { this.isReady = true; }

  draw() {
    const p5 = this.p5;

    // p5.background(this.sketch.background);

    p5.image(
      this.assets.bgGame, 
      0, 0, 
      this.GAME_WIDTH, 
      this.GAME_HEIGHT
    );

    // points bar asset
    const pointsBarSize = {
      width: 168*this.GAME_SCALE,
      height: 44*this.GAME_SCALE
    }
    p5.image(
      this.assets.scoreBar, 
      this.GAME_WIDTH/2-pointsBarSize.width/2,
      40*this.GAME_SCALE, 
      pointsBarSize.width, 
      pointsBarSize.height
    );

    // format
    p5.fill(255);
    p5.strokeWeight(2*this.GAME_SCALE);
    p5.stroke(255, 100, 0);
    p5.textSize(20*this.GAME_SCALE);
    p5.textStyle(p5.BOLD);

    // points
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.text(pad(this.score, 4), this.GAME_WIDTH/2-pointsBarSize.width/2+pointsBarSize.width*0.15, 62*this.GAME_SCALE);
    
    // multiplier
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.text(`x${this.scoreMultiplier}`, this.GAME_WIDTH/2+pointsBarSize.width/2-pointsBarSize.width*0.15, 62*this.GAME_SCALE);


    // timer
    const time = this.getCountDown();
    const message = time > 0 ? time + ' sec' : 'GAME OVER';
    p5.text(message, this.GAME_WIDTH/2, this.GAME_HEIGHT*0.9);
    if (time === 0) this.triggerFinishGame();
  }
  //#endregion p5.js main methods

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
    this.finalScore = this.score * this.scoreMultiplier;
    console.log('multiplier:', this.scoreMultiplier);
    console.log('finalScore:', this.finalScore);
  }
  //#endregion Custom methods
};