import Sketch from './sketch';
import { distanceBetween, angleBetween, getPixelCounter } from './utils';

export default class SketchPlayer extends Sketch {
  constructor(gameWidth, gameHeight, config) {
    super(gameWidth, gameHeight, config);

    this.completeShapePixels = 0;
    this.isTheFirstPhase = true;
    this.minProgress = 80;
    
    this.brushPos = null;
    this.lastPoint = null;

    // flags
    this.gameOver = false;
    this.isDrawing = false;
    this.isRenderingShape = true;

    this.bindEvents();
  }

  //#region p5.js main methods
  preload() {
    this.brush = this.p5.loadImage('resources/brush-cheese.png');
    this.shape = this.p5.loadImage('resources/shape.png');
  }

  setup() {
    this.p5.background(this.sketch.background);
    this.p5.noLoop();
    this.p5.pixelDensity(1);
  }
  
  draw() {
    if (this.gameOver) return;

    if (this.isRenderingShape) this.renderShape();

    if (this.isTheFirstPhase) this.setupPixels();

    if (this.isDrawing) this.drawBrush();
  }
  //#endregion p5.js main methods
  
  //#region p5.js event handlers
  pointerStart(e) {
    e.preventDefault();
    if (this.gameOver) return;
    this.isDrawing = true;
    this.lastPoint = { x: this.p5.mouseX, y: this.p5.mouseY };
    this.p5.loop();
  }

  pointerRelease() {
    if (this.gameOver) return;
    this.p5.noLoop();
    this.isDrawing = false;
    this.validatePixels();
  }
  //#endregion p5.js event handlers

  //#region Custom methods
  bindEvents() {
    this.pubsub.suscribe('gameOver', () => this.gameOver = true);
  }

  drawBrush() {
    const currentPoint = { x: this.p5.mouseX, y: this.p5.mouseY };
    const dist = distanceBetween(this.lastPoint, currentPoint);
    const angle = angleBetween(this.lastPoint, currentPoint);

    for (let i = 0; i < dist; i+=5) {
      const x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
      const y = this.lastPoint.y + (Math.cos(angle) * i) - 25;
      
      this.p5.image(this.brush, x+20, y+20, 10, 10);
    }

    this.lastPoint = currentPoint;
  }

  renderShape() {
    this.p5.image(
      this.shape, 
      this.canvas.width/2-100,
      this.canvas.height/2-100,
      210, 210
    );

    this.isRenderingShape = false;
  }

  updateShape() {
    this.p5.clear();
    this.isRenderingShape = true;
    this.p5.redraw();
  }

  setupPixels() {
    this.completeShapePixels = this.getBlackPixels();
    this.isTheFirstPhase = false;
    console.log('totalBlackPixels:', this.completeShapePixels);
  }

  validatePixels() {
    const blackPixels = this.getBlackPixels();
    const progress = 100 - Math.ceil(blackPixels/this.completeShapePixels*100);
    console.log({progress});

    if (progress >= this.minProgress) {
      this.updateShape();
      this.pubsub.publish('completedDraw');
    }
  }

  getBlackPixels() {
    this.p5.loadPixels();
    return getPixelCounter(this.p5.pixels, ({r, g, b, a}) => r+g+b === 0 && a === 255);
  }
  //#endregion Custom methods
};