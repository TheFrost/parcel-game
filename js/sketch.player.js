import Sketch from './sketch';
import PubSub from './pubsub';

export default class SketchPlayer extends Sketch {
  constructor(config) {
    super(config);

    this.pubsub = new PubSub();

    this.completeShapePixels = 0;
    this.isTheFirstPhase = true;
    this.isDrawingShape = true;
    this.gameOver = false;
    this.drawLevel = 80;
    this.shape = null;

    this.bindEvents();
  }

  //#region Custom methods
  bindEvents() {
    this.pubsub.suscribe('gameOver', () => this.gameOver = true);
  }

  validatePixels() {
    let blackPixels = this.getBlackPixels();    

    // only setup shape total pixels and stop method in the first draw.
    if (this.isTheFirstPhase) {
      this.completeShapePixels = blackPixels;
      this.isTheFirstPhase = false;
      return true;
    }

    let percentShape = 100 - Math.ceil(blackPixels/this.completeShapePixels*100);
    let event = percentShape >= this.drawLevel ? 'goodDraw' : 'failDraw';
    this.pubsub.publish(event);
    this.getNewShape();
  }

  getBlackPixels() {
    const p5 = this.p5;
    let blackPixels = 0;

    p5.loadPixels();
    for (let i = 0; i < p5.pixels.length; i+=4) {
      let r = p5.pixels[i],
          g = p5.pixels[i+1],
          b = p5.pixels[i+2],
          a = p5.pixels[i+3];

      let totalColor = r + g + b;
      if (totalColor === 0 && a === 255) blackPixels += 1;
    }

    return blackPixels;
  }

  drawCircle() {
    this.p5.ellipse(this.p5.width/2, this.p5.height/2, 200);
  }

  drawRectH() {
    this.p5.rect(this.p5.width/2, this.p5.height/2, this.p5.width*0.9, 200);
  }

  drawRectV() {
    this.p5.rect(this.p5.width/2, this.p5.height/2, 200, this.p5.height*0.5);
  }

  drawEllipse() {
    this.p5.ellipse(this.p5.width/2, this.p5.height/2, 300, 200);
  }

  getNewShape() {
    this.p5.clear();
    this.shape = this.p5.random([
      this.drawCircle,
      this.drawEllipse,
      this.drawRectH,
      this.drawRectV
    ]);
    this.isDrawingShape = true;
  }
  //#endregion Custom methods

  //#region p5.js main methods
  p5Setup() {
    this.p5.createCanvas(
      this.sketch.width,
      this.sketch.height
    );
    this.p5.background(this.sketch.background);
    this.p5.noLoop();
    this.p5.pixelDensity(1);

    this.p5.rectMode(this.p5.CENTER);
    this.getNewShape();
  }
  
  p5Draw() {
    if (this.gameOver) return;

    if (!this.isTheFirstPhase || !this.isDrawingShape) {
      this.p5.noStroke();
      this.p5.fill(255, 100, 0);
      this.p5.ellipse(
        this.p5.mouseX,
        this.p5.mouseY,
        20
      );
    }

    if (this.isDrawingShape) {
      this.p5.strokeWeight(10);
      this.p5.stroke(0);
      this.p5.noFill();
      this.shape();

      this.isDrawingShape = false;
    }
    
    if (this.isTheFirstPhase) this.validatePixels();
  }
  //#endregion p5.js main methods
  
  //#region p5.js event handlers
  onTouchStarted(e) {
    e.preventDefault();
    if (this.gameOver) return;
    this.p5.loop();
  }
  
  onTouchEnded() {
    this.validatePixels();
    this.p5.noLoop();
  }
  
  onMousePressed() {
    if (this.gameOver) return;
    this.p5.loop();
  }
  
  onMouseReleased() {
    this.validatePixels();
    this.p5.noLoop();
  }
  //#endregion p5.js event handlers
};