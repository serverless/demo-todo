const { User } = require('./models/User')

module.exports = function(app, DocumentClient) {
    /**
   *  Get All Users
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

  /**
   *  Create a User
   */
  app.post('/users', async (req,res) => {
    try {
      const putParams = User.put(req.body, { ReturnValues: 'ALL_OLD' })
      const response = await DocumentClient.put(putParams).promise()
      console.log(JSON.stringify(response, null, 2))
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
}