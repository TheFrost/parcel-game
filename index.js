/** Traditional reload after changes for JS parch ParcelJS */
if(module.hot){module.hot.dispose(()=>window.location.reload())}
/** end parch */

import GameApp from './js/game.app';


var height = window.innerHeight*0.8;
var width = height*0.6;
new GameApp({
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