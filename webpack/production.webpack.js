const commonConfig = require('./common.webpack')

const production = {
  mode: 'production'
};

module.exports = { ...commonConfig, ...production };