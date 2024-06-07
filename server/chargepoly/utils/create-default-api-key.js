/* global WIKI */
const moment = require('moment')
const ms = require('ms')

module.exports = async function createDefaultApiKey() {
  return WIKI.models.apiKeys.query().insert({
    name: process.env.API_KEY_NAME,
    key: process.env.API_KEY,
    expiration: moment.utc().add(ms('10y'), 'ms').toISOString(),
    isRevoked: false
  })
}
