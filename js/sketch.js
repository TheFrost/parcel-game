import p5 from 'p5';
import PubSub from './pubsub';

export default class Sketch {
  constructor(gameWidth, gameHeight, config) {
		this.p5 = null;
		
		this.GAME_WIDTH = gameWidth;
		this.GAME_HEIGHT = gameHeight;
		this.GAME_FACTOR = 0.9;

    this.sketch = {
      background: [0, 0],
      parent: null,
      ...config
		};
		
		this.pubsub = new PubSub();

    this.p5Instance();
	}
	
	resize() {
		const scale = Math.min(
			window.innerWidth / this.GAME_WIDTH,
			window.innerHeight / this.GAME_HEIGHT
		) * this.GAME_FACTOR;

		const width = Math.ceil(this.GAME_WIDTH * scale);
		const height = Math.ceil(this.GAME_HEIGHT * scale);

		this.p5.resizeCanvas(width, height, true);
	}

  p5Instance() {
    this.p5 = new p5((s) => { 
      s.setup = this.p5Setup.bind(this); 
      s.draw = this.p5Draw.bind(this);
      s.touchStarted = this.onTouchStarted.bind(this);
      s.touchMoved = this.onTouchMoved.bind(this);
      s.touchEnded = this.onTouchEnded.bind(this);
      s.mousePressed = this.onMousePressed.bind(this);
			s.mouseReleased = this.onMouseReleased.bind(this);
			s.windowResized = this.onWindowResized.bind(this);
      return s;
    }, this.sketch.parent);
  }

  p5Setup() {
		this.canvas = this.p5.createCanvas(
      this.GAME_WIDTH,
      this.GAME_HEIGHT
		);
		this.setup();
		this.resize();
	}

  p5Draw() { this.draw(); }

  onTouchStarted() {}

  onTouchMoved() {}

  onTouchEnded() {}

  onMousePressed() {}

	onMouseReleased() {}
	
	onWindowResized() { this.resize(); }
}