const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const app = require('lambda-api')({ version: 'v1.0', base: 'v1/' })
const { User } = require('./models/User')


/**
 * Users
 */
app.get('/users', async (req,res) => {
  try {
    const queryParams = User.query('user', { index: 'gsi1', limit: 10 })
    const response = await DocumentClient.query(queryParams).promise()
    const users = User.parse(response.Items)
    res.status(200).json({ status: 'ok', users })
  } catch (err) {
    console.error('Error fetching users', err)
    res.sendStatus(500)
  }
})

app.get('/users/:userId', async (req,res) => {
  try {
    const getParams = User.get({pk: `user#${req.params.userId }`})
    console.log({getParams})
    const response = await DocumentClient.get(getParams).promise()
    const user = User.parse(response.Item)
    res.status(200).json({ status: 'ok', user })
  } catch (err) {
    console.error('Error fetching user', req.params.userId, err)
    res.sendStatus(500)
  }
})

app.patch('/users/:userId', (req,res) => {
  res.status(200).json({ status: 'ok', userId: req.params.userId })
})




module.exports.router = (event, context, callback) => {

  // !!!IMPORTANT: Set this flag to false, otherwise the lambda function
  // won't quit until all DB connections are closed, which is not good
  // if you want to freeze and reuse these connections
  context.callbackWaitsForEmptyEventLoop = false

  // Run the request
  app.run(event,context,callback)

}

