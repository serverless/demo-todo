const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const app = require('lambda-api')({ version: 'v1.0', base: 'v1/' })
const usersController = require('./usersController')

usersController(app, DocumentClient)

module.exports.router = async (event, context) => {

  // !!!IMPORTANT: Set this flag to false, otherwise the lambda function
  // won't quit until all DB connections are closed, which is not good
  // if you want to freeze and reuse these connections
  context.callbackWaitsForEmptyEventLoop = false

  // Run the request
  return await app.run(event,context)
}

