/** Traditional reload after changes for JS parch ParcelJS */
if(module.hot){module.hot.dispose(()=>window.location.reload())}
/** end parch */

import GameApp from './game.app';

const app = new GameApp({
	gameWidth: 288,
	gameHeight: 512,
  player: {
    parent: 'sketch-player'
  },
  ui: {
    background: [73, 77, 97],
    parent: 'sketch-ui'
  }
});

app.init(2);