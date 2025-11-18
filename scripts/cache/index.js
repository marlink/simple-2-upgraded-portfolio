const path = require('path')
const { PersistentLRU } = require('./persistent-lru')

function getCache(name, options = {}) {
  const root = path.resolve(__dirname, '../../')
  const filePath = path.join(root, '.trae-cache', `${name}.json`)
  return new PersistentLRU(filePath, options)
}

module.exports = { getCache }