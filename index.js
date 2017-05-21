'use strict';

const config   = require('./config.json'),
      db       = require('./src/mongodbClient'),
      app      = require('./src/app');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, ' \nreason: ', reason);
});

db.once('open', () => {
  app.listen(config.port, () => console.info(`app listening on ${config.port} port.`));
});
