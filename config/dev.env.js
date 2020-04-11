'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DB_HOST: '"35.199.177.209"',
  DB_USER: '"root"',
  DB_PASSWORD: '"usxcj9BO3MGy1oi6"',
  OKTA_CLIENT_ID: '"0oa5nfl2jp46kSZDR4x6"',
  OKTA_ISSUER: '"https://dev-191564.okta.com/oauth2/default"'
})
