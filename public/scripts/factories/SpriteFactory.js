module.exports = (img, game, name) => {
  PIXI.loader.add(img).load(() => {
    const sprite = new PIXI.Sprite(
      PIXI.loader.resources[img].texture
    );
    game.stage.addChild(sprite);
    game.renderer.render(game.stage);
    game.sprite[name] = sprite;
  });
};
