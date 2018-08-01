/** Traditional reload after changes for JS parch ParcelJS */
if(module.hot){module.hot.dispose(()=>window.location.reload())}
/** end parch */

import GameApp from './game.app';

const app = new GameApp({
  gameWidth: 360,
  gameHeight: 640,
  player: {
    parent: 'sketch-player'
  },
  ui: {
    background: [73, 77, 97],
    parent: 'sketch-ui'
  }
});

app.init(2);