const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const _ = require('lodash')
const faker = require('faker')
const axios = require('axios')


async function createUser() {
  console.log('creating user')
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  console.log('Base url:', process.env.BASE_URL)
  await axios.post(`${process.env.BASE_URL}/users`, { firstName, lastName })
}

async function deleteUser() {
  console.log('deleting user')
  const usersQuery = User.query('user', { index: 'gsi1', limit: 10 })
  const usersResp = await DocumentClient.query(usersQuery).promise()
  const users = User.parse(usersResp.Items)
  await axios.delete(`${process.env.BASE_URL}/users/${user.id}`)
}

async function getUser() {
  console.log('getting user')
  const usersQuery = User.query('user', { index: 'gsi1', limit: 10 })
  const usersResp = await DocumentClient.query(usersQuery).promise()
  const users = User.parse(usersResp.Items)
  await axios.get(`${process.env.BASE_URL}/users/${user.id}`)
}


const actions = [
  createUser,
  createUser,
  createUser,
  getUser,
  getUser,
  getUser,
  getUser,
  getUser,
  getUser,
  getUser,
  getUser,
  getUser,
  deleteUser,
  deleteUser  
]

module.exports.invoke = async (event) => {
  action = _.sample(actions)
  await action()
}