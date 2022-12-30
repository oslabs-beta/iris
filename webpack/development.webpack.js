const commonConfig = require('./common.webpack')

const development = {
  mode: 'development'
};

module.exports = { ...commonConfig, ...development };