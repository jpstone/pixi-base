module.exports = (renderer) => {
  const stage = new PIXI.Container();
  renderer.render(stage);
  return {
    stage,
    renderer
  };
};
