const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});
const DocumentClient = new AWS.DynamoDB.DocumentClient()
const { User } = require('./models/User')
const _ = require('lodash')
const faker = require('faker')
const axios = require('axios')


async function createUser() {
  console.log('creating user')
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  console.log('Base url:', process.env.BASE_URL)
  await axios.post(`${process.env.BASE_URL}/v1/users`, { firstName, lastName })
}

async function deleteUser() {
  console.log('deleting user')
  const usersQuery = User.query('user', { index: 'gsi1', limit: 10 })
  const usersResp = await DocumentClient.query(usersQuery).promise()
  const users = User.parse(usersResp.Items)
  const user = _.sample(users)
  await axios.delete(`${process.env.BASE_URL}/v1/users/${user.id}`)
}

async function updateUser() {
  console.log('deleting user')
  const usersQuery = User.query('user', { index: 'gsi1', limit: 10 })
  const usersResp = await DocumentClient.query(usersQuery).promise()
  const users = User.parse(usersResp.Items)
  const user = _.sample(users)
  const updatedUser = {
    ...user,
    firstName: faker.name.firstName()
  }
  await axios.patch(`${process.env.BASE_URL}/v1/users/${user.id}`, updatedUser)
}

async function getUser() {
  console.log('getting user')
  const usersQuery = User.query('user', { index: 'gsi1', limit: 10 })
  const usersResp = await DocumentClient.query(usersQuery).promise()
  const users = User.parse(usersResp.Items)
  const user = _.sample(users)
  await axios.get(`${process.env.BASE_URL}/v1/users/${user.id}`)
}

async function getUsers() {
  console.log('getting users')
  await axios.get(`${process.env.BASE_URL}/v1/users`)
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
  getUsers,
  getUsers,
  getUsers,
  getUsers,
  getUsers,
  getUsers,
  getUsers,
  updateUser,
  updateUser,
  updateUser,
  updateUser,
  deleteUser,
  deleteUser  
]

module.exports.invoke = async (event) => {
  action = _.sample(actions)
  await action()
}