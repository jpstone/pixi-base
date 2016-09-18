'use strict';

const GameFactory = require('./factories/GameFactory');

const game = GameFactory(500, 700);

console.log(game);