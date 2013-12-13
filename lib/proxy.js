/**
 * Created by goran on 12/4/13.
 * @link "http://gonzalo123.com/2012/09/17/building-a-simple-tcp-proxy-server-with-node-js/"
 * @link "https://github.com/joyent/node/wiki/using-eclipse-as-node-applications-debugger"
 */
(function () {
    "use strict";
//        <%= scope.function_template(['nginx/vhost/_listen.conf.erb']) %>
//    A bit hackish but makes validator happy
    if (typeof INCOMING_PORT === 'undefined') {
        var INCOMING_PORT = 5858;
        var INCOMING_HOST = '192.168.10.2';
        var OUTGOING_PORT = 8125;
        var OUTGOING_HOST = "dev.hatch.js";
        var LOG_FILE = 'tcpproxy.log';
        var ENCODING = 'binary';
        var verbose = true;
    }

    var net = require('net');
    var winston = require('winston');
    var outgoingConnection, incomingServer;

    winston.add(winston.transports.File, { filename: LOG_FILE });
    winston.remove(winston.transports.Console);

    incomingServer = net.createServer(function (socket) {
        outgoingConnection = net.createConnection(
            parseInt(OUTGOING_PORT, 10), OUTGOING_HOST
        );
        outgoingConnection.setEncoding(ENCODING);
        outgoingConnection.setTimeout(0);
        outgoingConnection.on("data", function (data) {
            winston.info(
                'From outgoing to incoming:', verbose ? data.toString() : ''
            );
            socket.write(data);
        });
        outgoingConnection.addListener('end', function () {
            winston.info('Outgoing server closed connection');
            socket.end();
            outgoingConnection.end();
        });
        socket.setEncoding(ENCODING);
        socket.setTimeout(0);
        socket.addListener('end', function () {
            winston.info('Incoming server closed connection');
            socket.end();
            outgoingConnection.end();
        });
        socket.on('data', function (msg) {
            winston.info(
                'From incoming to outgoing ', verbose ? msg.toString() : ''
            );
            outgoingConnection.write(msg);
        });
    });

    incomingServer.listen(parseInt(INCOMING_PORT, 10), INCOMING_HOST);
    winston.info(
        "TCP server accepting connection on: " + INCOMING_HOST + ':'
            + INCOMING_PORT
    );
})();
