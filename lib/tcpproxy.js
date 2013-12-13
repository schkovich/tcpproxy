/**
 * Created by goran on 12/4/13.
 * @link "http://gonzalo123.com/2012/09/17/building-a-simple-tcp-proxy-server-with-node-js/"
 * @link "https://github.com/joyent/node/wiki/using-eclipse-as-node-applications-debugger"
 */
module.exports = function (incomingPort, incomingHost, outgoingPort,
                           outgoingHost, logFile, encoding, verbose) {
    "use strict";
    var net = require('net'), logger = require('winston'), incomingServer;

    logger.add(logger.transports.File, { filename: logFile });
    logger.remove(logger.transports.Console);

    incomingServer = net.createServer(function (socket) {
        var outgoingConnection = net.createConnection(
            parseInt(outgoingPort, 10),
            outgoingHost
        );
        outgoingConnection.setEncoding(encoding);
        outgoingConnection.setTimeout(0);
        outgoingConnection.on("data", function (data) {
            logger.info(
                'From outgoing to incoming:',
                verbose ? data.toString() : ''
            );
            socket.write(data);
        });
        outgoingConnection.addListener('end', function () {
            logger.info('Outgoing server closed connection');
            socket.end();
            outgoingConnection.end();
        });
        socket.setEncoding(encoding);
        socket.setTimeout(0);
        socket.addListener('end', function () {
            logger.info('Incoming server closed connection');
            socket.end();
            outgoingConnection.end();
        });
        socket.on('data', function (msg) {
            logger.info(
                'From incoming to outgoing ',
                verbose ? msg.toString() : ''
            );
            outgoingConnection.write(msg);
        });
    });

    return {
        start: function () {

            incomingServer.listen(parseInt(incomingPort, 10), incomingHost);
            logger.info(
                "TCP server accepting connection on: " + incomingHost + ':'
                    + incomingPort
            );

        }
    };
};
