const SpriteFactory = require('./SpriteFactory');
const keycode = require('./keycode');

module.exports = (game) => {
  SpriteFactory('public/img/player_ship.png', game, 'player');
};
