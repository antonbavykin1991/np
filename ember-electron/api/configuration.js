const TMP_DB_PATH = './db-path'
const db = require('../services/db')
const path = require('path')
const fs = require('fs')

const PASSWORD_FILE_NAME = 'password.db'

module.exports = {
  _checkDBPath () {
    return fs.existsSync(TMP_DB_PATH)
  },

  _getPasswordFilePath () {
    if (!this._checkDBPath()) {
      return null
    }

    const globalPath = fs.readFileSync(TMP_DB_PATH, 'utf8')

    return path.resolve(globalPath, PASSWORD_FILE_NAME)
  },

  _checkPasswordPath () {
    const passwordPath = this._getPasswordFilePath()

    if (!passwordPath) {
      return false
    }

    return fs.existsSync(passwordPath)
  },

  checkSetup (event, data, resolve, reject) {
    const setupData = {
      dbIsLoaded: this._checkDBPath(),
      passwordIsSetup: this._checkPasswordPath()
    }

    return resolve(setupData)
  },

  setupDB (event, data, resolve, reject) {
    const DBFolder = data.folder

    if (!DBFolder) {
      console.log('setupDB: Cannot find path')

      return reject({
        isError: true,
        reason: 'Cannot find path'
      })
    }

    fs.writeFile(TMP_DB_PATH, DBFolder,  (error) => {
      if (error) {
        console.log('setupDB: Cannot write file')

        return reject({
          isError: true,
          reason: 'Cannot write file'
        })
      }

      db.init({ filename: DBFolder, autoload: true }).then(() => {
        resolve({
          dbIsLoaded: true,
          passwordIsSetup: this._checkPasswordPath()
        })
      })
    })
  },

  setupPassword (event, data, resolve, reject) {
    const password = data.password

    console.log(password)

    if (!password) {
      console.log('setupPassword: Cannot read data.password')

      return reject({
        isError: true,
        reason: 'Cannot read data.password'
      })
    }

    const passwordPath = this._getPasswordFilePath()

    fs.writeFile(passwordPath, password, function (error) {
      if (error) {
        console.log(`setupPassword: Cannot write password to the file: ${passwordPath}`)

        return reject({
          isError: true,
          reason: `Cannot write password to the file: ${passwordPath}`
        })
      }

      return resolve({
        passwordIsSetup: true
      })
    })
  }
}