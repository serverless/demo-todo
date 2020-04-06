const uuid = require('uuid').v4

const TODO_STATUS = Object.freeze({
  todo: 'todo',
  complete: 'complete',
  incomplete: 'incomplete'
})

const Todo = new Model('Todo',{
  table: process.env.TODO_TABLENAME,
  model: false, // don't add the __model
  timestamps: true,

  partitionKey: 'pk',
  sortKey: 'sk',

  schema: {
    pk: { type: 'string', alias: 'parent', require: true },
    sk: { type: 'string', hidden: true, default: () => `todo#${uuid()}` },
    lsi: { type: 'string', hidden: true, default: `todo#${TODO_STATUS.todo}` }
    model: ['sk', 0]
    id: ['sk',1],
    name: { type: 'string' },
    description: { type: 'string' },
    status: ['lsi', 1]
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
  Todo,
  TODO_STATUS
}