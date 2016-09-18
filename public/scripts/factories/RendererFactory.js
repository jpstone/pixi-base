module.exports = (width, height) => {
  const renderer = PIXI.autoDetectRenderer(width, height);
  document.body.appendChild(renderer.view);
  return Object.assign(
    renderer
  );
};
