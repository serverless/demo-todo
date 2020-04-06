const { User } = require('./models/User')
const _ = require('lodash')

function randomError() {
  if (_.random(20) === 1 ) {
    throw new Error('This is a random error')
  }
}

module.exports = function(app, DocumentClient) {
    /**
   *  Get All Users
   */
  app.get('/users', async (req,res) => {
    randomError()
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

  /**
   *  Create a User
   */
  app.post('/users', async (req,res) => {
    randomError()
    try {
      const putParams = User.put(req.body)
      await DocumentClient.put(putParams).promise()
      const user = User.parse(putParams.Item)
      res.status(200).json({ status: 'ok', user })
    } catch (err) {
      console.error('Error creating user', req.body, err)
      res.sendStatus(500)
    }
  })

  /**
   *  Get One User
   */
  app.get('/users/:userId', async (req,res) => {
    randomError()
    try {
      const getParams = User.get({pk: `user#${req.params.userId }`})
      const response = await DocumentClient.get(getParams).promise()
      const user = User.parse(response.Item)
      res.status(200).json({ status: 'ok', user })
    } catch (err) {
      console.error('Error fetching user', req.params.userId, err)
      res.sendStatus(500)
    }
  })

  app.patch('/users/:userId', (req,res) => {
    randomError()
    try {
      const getParams = User.get({pk: `user#${req.params.userId }`})
      let response = await DocumentClient.get(getParams).promise()
      const user = User.parse(response.Item)
      const updatedUser = {
        ...user,
        ...req.body
      }
      const putParams = User.put(updatedUser)
      await DocumentClient.put(putParams).promise()
      res.status(200).json({ status: 'ok', user: updatedUser })
    } catch (err) {
      console.error('Error updating user', req.params.userId, err)
      res.sendStatus(500)
    }
  })
}