const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  var wsProxy = proxy("/socket", {
    target: "http://127.0.0.1:8080",
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    ws: true, // enable websocket proxy
    logLevel: "debug"
  });
  app.use(wsProxy);
};
