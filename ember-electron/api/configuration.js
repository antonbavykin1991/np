const db = require('../services/db')
const path = require('path')
const fs = require('fs')

const PASSWORD_FILE_NAME = 'password.db'

module.exports = {
  globalPath: null,

  _setGlobalPath (globalPath) {
    this.globalPath = globalPath
  },

  _checkGlobalPath () {
    return this.globalPath
  },

  _getPasswordFilePath () {
    if (!this.globalPath) {
      return null
    }

    return path.resolve(this.globalPath, PASSWORD_FILE_NAME)
  },

  _checkPasswordPath () {
    const passwordPath = this._getPasswordFilePath()

    if (!passwordPath) {
      return false
    }

    return fs.existsSync(passwordPath)
  },

  _setupDB () {
    return db.init({ filename: this.globalPath, autoload: true })
  },

  checkSetup (event, data, resolve, reject) {
    this._setGlobalPath(data.globalPath)

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
    const globalPath = data.globalPath

    if (!globalPath) {
      console.log('setupGlobalPath: Cannot find globalPath')

      return reject({
        isError: true,
        reason: 'Cannot find globalPath'
      })
    }

    return this.checkSetup(event, data, resolve, reject)
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
  },

  checkPassword (event, data, resolve, reject) {
    const password = data.password

    if (!password) {
      console.log('checkPassword: Cannot read data.password')

      return reject({
        isError: true,
        reason: 'Cannot read data.password'
      })
    }

    const passwordPath = this._getPasswordFilePath()


    fs.readFile(passwordPath, 'utf8', function (error, fileData) {
      if (error) {
        console.log(`checkPassword: Cannot read file: ${passwordPath}`)

        return reject({
          isError: true,
          reason: `Cannot read file: ${passwordPath}`
        })
      }

      console.log(fileData, password)

      if (fileData !== password) {
        console.log(`checkPassword: Password is not match`)

        return reject({
          isError: true,
          reason: `Password is not match`
        })
      }

      return resolve({
        isAuthenticated: true
      })
    })
  }
}