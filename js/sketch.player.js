import Sketch from './sketch';
import PubSub from './pubsub';

export default class SketchPlayer extends Sketch {
  constructor(config) {
    super(config);

    this.pubsub = new PubSub();

    this.completeShapePixels = 0;
    this.percentShape = 0;
    this.isTheFirstPhase = true;

    this.bindEvents();
  }

  //#region Custom methods
  bindEvents() {
    
  }

  validatePixels() {
    var blackPixels = 0;
    this.p5.loadPixels();
    for (let i = 0; i < this.p5.pixels.length; i+=4) {
      let totalColor = this.p5.pixels[i] + this.p5.pixels[i+1] + this.p5.pixels[i+2];
      if (totalColor === 0 && this.p5.pixels[i+3] === 255) blackPixels += 1;
    }

    if (this.isTheFirstPhase) {
      this.completeShapePixels = blackPixels;
      this.isTheFirstPhase = false;
    } else {
      this.percentShape = 100 - Math.ceil(blackPixels/this.completeShapePixels*100) + '%';
      this.pubsub.publish('updatePoints', this.percentShape);
    }
  }
  //#endregion Custom methods

  //#region p5.js main methods
  p5Setup() {
    var canvas = this.p5.createCanvas(
      this.sketch.width,
      this.sketch.height
    );
    this.p5.background(this.sketch.background);
    this.p5.noLoop();
  }
  
  p5Draw() {
    this.p5.strokeWeight(10);
    this.p5.noFill();
    this.p5.ellipse(this.p5.width/2, this.p5.height/2, 200);
    
    this.p5.noStroke();
    this.p5.fill(255, 100, 0);
    if (!this.isTheFirstPhase) this.p5.ellipse(
      this.p5.mouseX,
      this.p5.mouseY,
      20
    );
    
    if (this.isTheFirstPhase) this.validatePixels();
  }
  //#endregion p5.js main methods
  
  //#region p5.js event handlers
  onTouchStarted(e) {
    e.preventDefault();
    this.p5.loop();
  }
  
  onTouchEnded() {
    this.validatePixels();
    this.p5.noLoop();
  }
  
  onMousePressed() {
    this.p5.loop();
  }
  
  onMouseReleased() {
    this.validatePixels();
    this.p5.noLoop();
  }
  //#endregion p5.js event handlers
};