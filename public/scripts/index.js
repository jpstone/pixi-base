'use strict';

const GameFactory = require('./factories/GameFactory');
const SpriteFactory = require('./factories/SpriteFactory');
const game = GameFactory(500, 700);

SpriteFactory('public/img/player_ship.png', game);
