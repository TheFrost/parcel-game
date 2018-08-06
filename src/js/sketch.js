import p5 from 'p5';
import PubSub from './pubsub';

export default class Sketch {
  constructor(gameWidth, gameHeight, config) {
    this.p5 = null;
    
    this.BASE_WIDTH = gameWidth;
    this.BASE_HEIGHT = gameHeight;
    this.BASE_FACTOR = 0.9;

    this.sketch = {
      background: [0, 0],
      parent: null,
      ...config
    };
    
    this.pubsub = new PubSub();

    this.p5Instance();
  }

  p5Instance() {
    this.p5 = new p5((s) => { 
      s.preload = this.preload.bind(this);
      s.setup = this.p5Setup.bind(this); 
      s.draw = this.draw.bind(this);
      s.touchStarted = this.pointerStart.bind(this);
      s.touchEnded = this.pointerRelease.bind(this);
      s.mousePressed = this.pointerStart.bind(this);
      s.mouseReleased = this.pointerRelease.bind(this);
      s.windowResized = this.windowResize.bind(this);
      return s;
    }, this.sketch.parent);
  }

  preload() {}

  p5Setup() {
    this.canvas = this.p5.createCanvas(
      this.BASE_WIDTH,
      this.BASE_HEIGHT
    );
    this.p5.noLoop();
    this.p5.pixelDensity(1);
    
    this.resizeCalc();

    this.setup();
  }
  
  resizeCalc() {
    const { visualViewport, innerWidth, innerHeight } = window;
    const viweportWidth = visualViewport ? visualViewport.width : innerWidth;
    const viweportHeight = visualViewport ? visualViewport.height : innerHeight;

    this.GAME_SCALE = Math.min(
      viweportWidth / this.BASE_WIDTH,
      viweportHeight / this.BASE_HEIGHT
    ) * this.BASE_FACTOR;

    this.GAME_WIDTH = Math.ceil(this.BASE_WIDTH * this.GAME_SCALE);
    this.GAME_HEIGHT = Math.ceil(this.BASE_HEIGHT * this.GAME_SCALE);


    this.p5.resizeCanvas(this.GAME_WIDTH, this.GAME_HEIGHT);
  }
  
  pointerStart() {}

  pointerRelease() {}

  windowResize() {
    this.resizeCalc();
    this.resize();
  }

  resize() {}
}