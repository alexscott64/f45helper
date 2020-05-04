const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
const OktaJwtVerifier = require('@okta/jwt-verifier')

require('dotenv').config();
const oktaClientId = process.env.OKTA_CLIENT_ID;
const oktaIssuer = process.env.OKTA_ISSUER;

const dbHost = process.env.DATABASE_HOST;
const dbPort = process.env.DATABASE_PORT;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: oktaClientId,
  issuer: oktaIssuer
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
})

// mysql database
let database = new Sequelize('hiithelper', dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql'
})

// Define our Exercise model
// contains, exercise_name, exercise_description, exercise_image_url
let Exercise = database.define('exercises', {
  exercise_name: Sequelize.STRING,
  exercise_description: Sequelize.STRING(2048),
  exercise_image_url: Sequelize.STRING(2048)
})

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Exercise model
let userResource = finale.resource({
  model: Exercise,
  endpoints: ['/exercises', '/exercises/:id']
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: true })
  .then(() => {
    app.listen(8081, () => {
      console.log('listening to port localhost:8081')
    })
  })