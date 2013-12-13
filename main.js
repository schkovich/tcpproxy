var tcpproxy = require("./lib/tcpproxy.js"),
    nconf = require("./lib/config.js"),
    proxy,
    config;

config = nconf();
proxy = tcpproxy(
    config.get("incomingPort"),
    config.get("incomingHost"),
    config.get("outgoingPort"),
    config.get("outgoingHost"),
    config.get("logFile"),
    config.get("encoding"),
    config.get("verbose")
);
proxy.start();
