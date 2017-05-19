'use strict';

const config = require('./config.json'),
      db = require('./src/mongodb'),
      app = require('./src/app');

db.once('open', () => {
  app.listen(config.port, () => console.info(`app listening on ${config.port} port.`));
});
