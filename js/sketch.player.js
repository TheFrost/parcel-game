import Sketch from './sketch';

import brushPattern from '../resources/brush-cheese.png';

const distanceBetween = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
const angleBetween = (p1, p2) => Math.atan2(p2.x - p1.x, p2.y - p1.y);

export default class SketchPlayer extends Sketch {
  constructor(gameWidth, gameHeight, config) {
    super(gameWidth, gameHeight, config);

    this.completeShapePixels = 0;
    this.isTheFirstPhase = true;
    this.isDrawingShape = true;
    this.gameOver = false;
    this.drawLevel = 80;
		this.shape = null;
		this.brush = null;

    this.brushPos = null;
    this.lastPoint = null;

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

  pointerStart() {
    if (this.gameOver) return;
    this.lastPoint = { x: this.p5.mouseX, y: this.p5.mouseY };
    this.p5.loop();
  }

  pointerRelease() {
    this.validatePixels();
    this.p5.noLoop();
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
  setup() {
    this.p5.background(this.sketch.background);
    this.p5.noLoop();
    this.p5.pixelDensity(1);

    this.p5.rectMode(this.p5.CENTER);
		this.getNewShape();
		
		this.brush = this.p5.loadImage(brushPattern);

		console.log(this.p5);
  }
  
  draw() {
    if (this.gameOver) return;

    if (!this.isTheFirstPhase || !this.isDrawingShape) {
      const currentPoint = { x: this.p5.mouseX, y: this.p5.mouseY };
      const dist = distanceBetween(this.lastPoint, currentPoint);
      const angle = angleBetween(this.lastPoint, currentPoint);

      for (let i = 0; i < dist; i+=5) {
        const x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
        const y = this.lastPoint.y + (Math.cos(angle) * i) - 25;

        // this.p5.noStroke();
        // this.p5.fill(255, 100, 0);
				// this.p5.ellipse(x+20, y+20, 20);
				
				this.p5.image(this.brush, x+20, y+20, 10, 10);
      }

      this.lastPoint = currentPoint;
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
    this.pointerStart();
  }
  
  onTouchEnded() {
    this.pointerRelease();
  }
  
  onMousePressed() {
    this.pointerStart();
  }
  
  onMouseReleased() {
    this.pointerRelease();
  }
  //#endregion p5.js event handlers
};