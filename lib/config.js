/**
 * Created by goran on 12/13/13.
 */

/**
 * Load configuration based on application environment
 * Possible values: production, staging, development
 *
 * @returns {Provider}
 */
module.exports = function () {
    "use strict";
    /**
     * Holds instance of nconf.Provider
     *
     * @type Provider
     * @link "https://github.com/flatiron/nconf"
     */
    var config = require('nconf'),
        getFileName;

    getFileName = function () {
        var name = '';
        switch (process.env.NODE_ENV) {
        case 'production':
            name = process.env.NODE_ENV;
            break;
        case 'staging':
            name = process.env.NODE_ENV;
            break;
        default:
            name = 'development';
        }

        return __dirname + '/../config/' + name + '.json';
    };

    config.file(getFileName());
    config.load();
    return config;
};
