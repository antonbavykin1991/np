const {ipcMain, app, BrowserWindow, shell} = require('electron')

const RESPONCE_POSTFIX = 'responce'

const api = require('../api')

module.exports = {
  init () {
    this._onMessage = this._onMessage.bind(this)
    ipcMain.on('message', this._onMessage)
  },

  _onMessage(event, data) {
    const eventName = this._getEventName(data)
    const responceEventName = this._getResponceEventName(eventName)
    const webContents = this._getWebContents(event)

    const resFunction = (responce) => webContents.send(responceEventName, responce)

    this._response(...arguments)
      .then(resFunction)
      .catch(resFunction)
  },

  _response(event, data) {
    return new Promise((resolve, reject) => {
      this._eventRoute(event, data, resolve, reject)
    })
  },

  _eventRoute(event, data, resolve, reject) {
    const eventName = this._getEventName(data)
    const eventResolver = this._eventResolver(eventName)

    if (!eventResolver.name || !eventResolver.method) {
      console.log('_eventRoute:', 'eventName name should be like name:methodName')

      return reject({
        isError: true,
        reason: 'eventName name should be like name:methodName'
      })
    }

    if (!api[eventResolver.name]) {
      console.log('_eventRoute:', `There is no api for ${eventResolver.name}`)

      return reject({
        isError: true,
        reason: `There is no api for ${eventResolver.name}`
      })
    }

    if (!api[eventResolver.name][eventResolver.method]) {
      console.log('_eventRoute:', `There is no method: ${eventResolver.method} in api: ${eventResolver.name}`)

      return reject({
        isError: true,
        reason: `There is no method: ${eventResolver.method} in api: ${eventResolver.name}`
      })
    }

    api[eventResolver.name][eventResolver.method](...arguments)
  },

  _getEventName (data = {}) {
    return data.eventName
  },

  _eventResolver(eventName) {
    const data = eventName.split(':');

    return {
      name: (data && data[0]) || null,
      method: (data && data[1]) || null
    }
  },

  _getResponceEventName (eventName) {
    return `${eventName}-${RESPONCE_POSTFIX}`
  },

  _getWebContents (event) {
    return event.sender.webContents
  },

  // setupDB (event, data, resolve, reject) {
  //   const DBFolder = data.folder

  //   if (!DBFolder) {
  //     reject({isError: true, reason: 'Cannot find path'})
  //   }

  //   fs.writeFile(TMP_DB_PATH, DBFolder, function (error) {
  //     if (error) {
  //       return reject({
  //         isError: true,
  //         reason: 'cannot write file'
  //       })
  //     }

  //     db.init({ filename: DBFolder, autoload: true }).then(() => {
  //       resolve({folder: DBFolder})
  //     })
  //   })
  // },

  // _checkDBSetup () {
  //   return new Promise((resolve, reject) => {
  //     fs.exists(TMP_DB_PATH, (exists) => {

  //       resolve({dbIsLoaded: !!exists})
  //     })
  //   })
  // },

  // checkSetup (event, data, resolve, reject) {
  //   const setupData = {
  //     dbIsLoaded: false,
  //     passwordIsSetup: false
  //   }

  //   return this._checkDBSetup().then(({dbIsLoaded}) => {
  //     setupData.dbIsLoaded = dbIsLoaded
  //   }).then(() => {
  //     setupData.passwordIsSetup = false
  //   }).then(() => {
  //     return resolve(setupData)
  //   })
  // },

  // checkAuth (event, data, resolve, reject) {
  //   const pdfPath = path.join(__dirname, 'print.pdf')

  //   const win = BrowserWindow.fromWebContents(event.sender)

  //   win.webContents.printToPDF({printBackground: true, landscape: true, pageSize: 'A5'}, function (error, resultData) {
  //     if (error) {
  //       return reject({
  //         isError: true,
  //         reason: 'cannot print'
  //       })
  //     }

  //     fs.writeFile(pdfPath, resultData, function (error) {
  //       if (error) {
  //         return reject({
  //           isError: true,
  //           reason: 'cannot print file'
  //         })
  //       }

  //       shell.openExternal('file://' + pdfPath)

  //       event.sender.send('wrote-pdf', pdfPath)
  //     })
  //   })
  // }

}