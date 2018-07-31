import p5 from 'p5';

export default class Sketch {
  constructor(config) {
    this.p5 = null;

    this.sketch = {
      width: 300,
      height: 400,
      background: [0, 0],
      parent: null,
      ...config
    };

    this.p5Instance();
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
      return s;
    }, this.sketch.parent);
  }

  p5Setup() {}

  p5Draw() {}

  onTouchStarted() {}

  onTouchMoved() {}

  onTouchEnded() {}

  onMousePressed() {}

  onMouseReleased() {}
}