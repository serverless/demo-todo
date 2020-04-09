const { User } = require('../models/User')
const _ = require('lodash')
const axios = require('axios')

class RandomError extends Error {
  constructor(msg, status) {
    super(msg)
    this.status = status || 500
  }

}

const randomStatus = () => _.sample([ 401, 403, 404, 405, 406, 501, 503 ])

async function randomness() {
  const chance = _.random(20) 
  switch(chance) {
    case 1:
      RandomError('This is a random error', randomStatus())
      break
    case 2:
      await axios.get('https://en.wikipedia.org/wiki/Main_Page')
      break
  }
}

module.exports = function(app, DocumentClient) {
    /**
   *  Get All Users
   */
  app.get('/users', async (req,res) => {
    try {
      randomness()
      const queryParams = User.query('user', { index: 'gsi1', limit: 10 })
      const response = await DocumentClient.query(queryParams).promise()
      const users = User.parse(response.Items)
      return { status: 'ok', users }
    } catch (err) {
      console.error('Error fetching users', err)
      return {
        statusCode: error.status || 500,
        body: JSON.stringify({ error: err.message })
      }    
    }
  })

  /**
   *  Create a User
   */
  app.post('/users', async (req,res) => {
    randomness()
    try {
      const putParams = User.put(req.body)
      await DocumentClient.put(putParams).promise()
      const user = User.parse(putParams.Item)
      return { status: 'ok', user }
    } catch (err) {
      console.error('Error creating user', req.body, err)
      return {
        statusCode: error.status || 500,
        body: JSON.stringify({ error: err.message })
      } 
    }
  })

  /**
   *  Get One User
   */
  app.get('/users/:userId', async (req,res) => {
    randomness()
    try {
      const getParams = User.get({pk: `user#${req.params.userId }`})
      const response = await DocumentClient.get(getParams).promise()
      const user = User.parse(response.Item)
      req.context.serverlessSdk.tagEvent('user', req.params.userId, user)
      return { status: 'ok', user }
    } catch (err) {
      console.error('Error fetching user', req.params.userId, err)
      return {
        statusCode: error.status || 500,
        body: JSON.stringify({ error: err.message })
      } 
    }
  })

  /**
   *  Update User
   */
  app.patch('/users/:userId', async (req,res) => {
    randomness()
    try {
      const getParams = User.get({pk: `user#${req.params.userId }`})
      let response = await DocumentClient.get(getParams).promise()
      const user = User.parse(response.Item)
      const updatedUser = {
        ...user,
        ...req.body
      }
      const updateParams = User.update(updatedUser)
      await DocumentClient.update(updateParams).promise()
      req.context.serverlessSdk.tagEvent('user', req.params.userId, updatedUser)
      return { status: 'ok', user: updatedUser }
    } catch (err) {
      console.error('Error updating user', req.params.userId, err)
      return {
        statusCode: error.status || 500,
        body: JSON.stringify({ error: err.message })
      } 
    }
  })

  /**
   * Delete a user
   */
  app.delete('/users/:userId', async (req,res) => {
    randomness()
    try {
      const delParams = User.delete({pk: `user#${req.params.userId }`})
      await DocumentClient.delete(delParams).promise()
      req.context.serverlessSdk.tagEvent('user', req.params.userId)
      return { status: 'ok' }
    } catch (err) {
      console.error('Error deleting user', req.params.userId, err)
      return {
        statusCode: error.status || 500,
        body: JSON.stringify({ error: err.message })
      } 
    }
  })
}