'use strict';

const config = require('./config.json'),
      app = require('./src/app');

app.listen(config.port, () => console.info(`app listening on ${config.port} port.`));
