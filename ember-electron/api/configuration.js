const TMP_DB_PATH = './db-path'
const db = require('../services/db')
const path = require('path')
const fs = require('fs')

const PASSWORD_FILE_NAME = 'password.db'

module.exports = {
  _checkGlobalPath () {
    return fs.existsSync(TMP_DB_PATH)
  },

  _getGlobalPath () {
    if (!this._checkGlobalPath()) {
      return null
    }

    return fs.readFileSync(TMP_DB_PATH, 'utf8')
  },

  _getPasswordFilePath () {
    if (!this._checkGlobalPath()) {
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

  _setupDB () {
    const globalPath = this._getGlobalPath()
    return db.init({ filename: globalPath, autoload: true })
  },

  _getSetupData () {
    const setupData = {
      globalPathIsSetup: this._checkGlobalPath(),
      passwordIsSetup: this._checkPasswordPath()
    }

    return new Promise((resolve) => {
      if (this._checkGlobalPath()) {
        return this._setupDB().then(() => {
          resolve(setupData)
        })
      }

      resolve(setupData)
    })
  },

  checkSetup (event, data, resolve, reject) {
    const setupData = {
      globalPathIsSetup: this._checkGlobalPath(),
      passwordIsSetup: this._checkPasswordPath()
    }

    if (this._checkGlobalPath()) {
      return this._setupDB().then(() => {
        resolve(setupData)
      })
    }

    resolve(setupData)
  },

  setupGlobalPath (event, data, resolve, reject) {
    const DBFolder = data.folder

    if (!DBFolder) {
      console.log('setupGlobalPath: Cannot find path')

      return reject({
        isError: true,
        reason: 'Cannot find path'
      })
    }

    fs.writeFile(TMP_DB_PATH, DBFolder,  (error) => {
      if (error) {
        console.log('setupGlobalPath: Cannot write file')

        return reject({
          isError: true,
          reason: 'Cannot write file'
        })
      }

      return this.checkSetup(null, null, resolve, reject)
    })
  },

  setupPassword (event, data, resolve, reject) {
    const password = data.password

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