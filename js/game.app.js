import SketchPlayer from './sketch.player';
import SketchUI from './sketch.ui';

export default class GameApp {
  constructor(config = {}) {
    this.config = config;
    this.init(config);
  }

  init() {
    new SketchPlayer(
			this.config.gameWidth,
			this.config.gameHeight,
			this.config.player
		);
    new SketchUI(
			this.config.gameWidth,
			this.config.gameHeight,
			this.config.ui
		);
  }
}