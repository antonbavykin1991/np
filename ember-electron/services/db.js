const fs = require('fs')
const path = require('path')

const STORE_FILE = 'store.nedb'

module.exports = {
  db: null,

  init: function (params) {
    const filename = params.filename

    const Datastore = require('nedb')

    return this.checkFiles(filename).then(({fullPath}) => {
      this.db = new Datastore(Object.assign({}, params, {filename: fullPath}))
    })
  },

  isFileExists: function (filePath) {
    return new Promise((resolve, reject) => {
      fs.exists(filePath, (exists) => {
        resolve({exists})
      })
    })
  },

  createFile: function (filePath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, '', (error) => {
        if (error) {
          return reject({
            isError: true,
            reason: 'Cannot create file: ' + filePath
          })
        }

        return resolve({filePath})
      })
    })
  },

  checkFiles: function (folderPath) {
    const fullPath = path.resolve(folderPath, STORE_FILE)

    return this.isFileExists(fullPath).then(({exists}) => {
      if (!exists) {
        return this.createFile(fullPath)
      }

      return {fullPath}
    })
  },

  _response (params, method) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject({
          isError: true,
          reason: 'You should setup Database first'
        })
      }

      if (!this.db[method]) {
        return reject({
          isError: true,
          reason: 'Cannot find method: ' + method
        })
      }

      this.db[method](params, function (err, result) {
        if (err) {
          return reject(err)
        }

        resolve(result)
      })
    })
  },

  insert: function (params) {
    return this._response(params, 'insert')
  },

  find: function (params) {
    return this._response(params, 'find')
  }

}