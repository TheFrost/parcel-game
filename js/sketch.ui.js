import Sketch from './sketch';
import PubSub from './pubsub';

export default class SketchUI extends Sketch {
  constructor(config) {
    super(config);

    this.timer = config.timeLimit || 60; // in seconds
    this.startTime = Date.now();

    this.userPoints = 0;
    this.pointsPerShape = 10;
    this.pointsMultiplier = 1;
    this.counterGoods = 0;
    this.multiplierLimitChanger = 3;
    this.pubsub = new PubSub();

    this.init();
  }

  //#region Custom methods
  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.pubsub.suscribe('goodDraw', this.onGoodDraw, this);
    this.pubsub.suscribe('failDraw', this.onFailDraw, this);
  }

  onGoodDraw() {
    this.userPoints += (this.pointsPerShape * this.pointsMultiplier);
    this.counterGoods += 1;
    
    if (this.counterGoods % this.multiplierLimitChanger === 0) {
      this.pointsMultiplier += 1;
    }
  }
  
  onFailDraw() {
    this.counterGoods = 0;
    this.pointsMultiplier = 1;
  }

  getCountDown() {
    let ellapsed = this.p5.floor((Date.now() - this.startTime)/1000);
    return this.timer - ellapsed;
  }
  //#endregion Custom methods

  //#region p5.js main methods
  p5Setup() {
    this.p5.createCanvas(
      this.sketch.width,
      this.sketch.height
    );
  }

  p5Draw() {
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
    p5.text(this.userPoints, p5.width/2, 50);

    // timer
    let time = this.getCountDown();
    let message = time > 0 ? time + ' sec' : 'GAME OVER';
    p5.text(message, p5.width/2, p5.height*0.9);
    if (time === 0) {
      this.pubsub.publish('gameOver');
      p5.noLoop();
    }
  }
  //#endregion p5.js main methods
};