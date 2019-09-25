const app = require("../app");
const middlewares = require("../config")();
const package = require("../../package.json");

module.exports = {
  ping: app.use(middlewares, (context) => {
    context.send({
      requestId: context.id,
      provider: context.providerType,
      name: package.name,
      version: package.version,
      timestamp: Date.now()
    });
  })
};
