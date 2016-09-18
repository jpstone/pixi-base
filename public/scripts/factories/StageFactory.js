module.exports = (renderer) => {
  const stage = new PIXI.Container();
  renderer.render(stage);
  return Object.assign({
    stage: stage,
    renderer: renderer
  });
};
