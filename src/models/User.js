const uuid = require('uuid').v4
const { Model } = require('dynamodb-toolbox')

const User = new Model('User',{
  table: process.env.TODO_TABLENAME || 'demo-todo-dev',
  model: false, // don't add the __model
  timestamps: true,

  partitionKey: 'pk',
  sortKey: 'sk',

  schema: {
    pk: { type: 'string', hidden: true, default: () => `user#${uuid()}` },
    sk: { type: 'string', hidden: true, default: 'meta' },
    gsi1pk: { type: 'string', hidden: true, default: 'user' },
    gsi1sk: { type: 'string', hidden: true, default: () => new Date().toISOString() },
    created: ['gsi1sk', 0],
    model: ['pk',0],
    id: ['pk',1],
    firstName: { type: 'string' },
    lastName: { type: 'string' }
  },

  indexes: {
    lsi: {
      partitionKey: 'pk',
      sortKey: 'lsi'
    },
    gsi1: {
      partitionKey: 'gsi1pk',
      sortKey: 'gsi1sk'
    }
  }
})

module.exports = {
  User
}