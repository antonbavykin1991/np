const TMP_DB_PATH = './db-path'
const db = require('../services/db')
const fs = require('fs')

module.exports = {
  _checkDBPath () {
    return fs.existsSync(TMP_DB_PATH)
  },

  checkSetup (event, data, resolve, reject) {
    const setupData = {
      dbIsLoaded: this._checkDBPath(),
      passwordIsSetup: false
    }

    return resolve(setupData)
  },

  setupDB (event, data, resolve, reject) {
    const DBFolder = data.folder

    if (!DBFolder) {
      console.log('setupDB: Cannot find path')

      reject({
        isError: true,
        reason: 'Cannot find path'
      })
    }

    fs.writeFile(TMP_DB_PATH, DBFolder, function (error) {
      if (error) {
        console.log('setupDB: Cannot write file')

        return reject({
          isError: true,
          reason: 'Cannot write file'
        })
      }

      db.init({ filename: DBFolder, autoload: true }).then(() => {
        resolve({folder: DBFolder})
      })
    })
  },
}