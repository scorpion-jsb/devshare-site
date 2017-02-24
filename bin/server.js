const config = require('../config');
const server = require('../server/main');
const debug = require('debug')('app:bin:server');  // eslint-disable-line import/no-extraneous-dependencies
const ip = require('ip'); // eslint-disable-line import/no-extraneous-dependencies

const port = config.server_port;

server.listen(port);
debug(`Server is now running at http://localhost:${port}.`);
debug(`Site is available on your network at ${ip.address()}:${port}`);
