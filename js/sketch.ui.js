import Sketch from './sketch';
import PubSub from './pubsub';

export default class SketchUI extends Sketch {
  constructor(config) {
    super(config);

    this.timer = config.timeLimit || 60; // in seconds
    this.startTime = Date.now();
    this.lastSecond = 0;
    this.points = 0;
    this.pubsub = new PubSub();

    this.init();
  }

  //#region Custom methods
  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.pubsub.suscribe('updatePoints', points => this.points = points);
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

    p5.fill(255);
    p5.strokeWeight(3);
    p5.stroke(255, 100, 0);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(32);
    p5.textStyle(p5.BOLD);

    // points
    p5.text(this.points, p5.width/2, 50);

    // timer
    var ellapsed = p5.floor((Date.now() - this.startTime)/1000);
    if (ellapsed !== this.lastSecond) {
      this.lastSecond = ellapsed;
    }
    var time = this.timer - ellapsed;
    p5.text(time, p5.width/2, p5.height*0.9);
  }
  //#endregion p5.js main methods
};