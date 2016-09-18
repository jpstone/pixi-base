const RendererFactory = require('./RendererFactory');
const StageFactory = require('./StageFactory');

module.exports = (width, height) => {
  return Object.assign(
    StageFactory(RendererFactory(width, height)),
    { sprite: {} }
  );
};
