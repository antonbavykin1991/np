const {ipcMain, app, BrowserWindow, Menu, Tray, shell} = require('electron')
const Datastore = require('nedb')
const path = require('path')

// const db = new Datastore({ filename: '/Users/antonbavykin/db', autoload: true });
// const store = {}

const fs = require('fs')


// db.insert(doc, function (err, newDoc) {   // Callback is optional
//   // newDoc is the newly inserted document, including its _id
//   // newDoc has no key called notToBeSaved since its value was undefined
// });

// db.loadDatabase(function (err) {    // Callback is optional

//   console.log(err, 'data loaded')

//   db.find({ hello: 'world' }, function (err, docs) {
//     console.log(err, docs)
//   });
// });


const RESPONCE_POSTFIX = 'responce'

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

    this._responce(...arguments)
      .then(resFunction)
      .catch(resFunction)
  },

  _responce(event, data) {
    return new Promise((resolve, reject) => {
      this._eventRoute(event, data, resolve, reject)
    })
  },

  _eventRoute(event, data, resolve, reject) {
    const eventName = this._getEventName(data)

    if (!this[eventName]) {
      const errorMessage = `error: there is on Event for ${eventName}`

      return reject({
        isError: true,
        reason: errorMessage
      })
    } else {
      this[eventName](...arguments)
    }
  },

  _getEventName (data = {}) {
    return data.eventName
  },

  _getResponceEventName (eventName) {
    return `${eventName}-${RESPONCE_POSTFIX}`
  },

  _getWebContents (event) {
    return event.sender.webContents
  },

  setupDB (event, data, resolve, reject) {
    const DBFolder = data.folder

    if (!DBFolder) {
      reject({isError: true, reason: 'Cannot find path'})
    }

    const tmpDBPath = './db-path';

    fs.writeFile(tmpDBPath, DBFolder, function (error) {
      if (error) {
        return reject({
          isError: true,
          reason: 'cannot write file'
        })
      }

      return resolve({folder: DBFolder})
    })
  },

  checkAuth (event, data, resolve, reject) {
    const pdfPath = path.join(__dirname, 'print.pdf')

    const win = BrowserWindow.fromWebContents(event.sender)

    win.webContents.printToPDF({printBackground: true, landscape: true, pageSize: 'A5'}, function (error, resultData) {
      if (error) {
        return reject({
          isError: true,
          reason: 'cannot print'
        })
      }

      fs.writeFile(pdfPath, resultData, function (error) {
        if (error) {
          return reject({
            isError: true,
            reason: 'cannot print file'
          })
        }

        shell.openExternal('file://' + pdfPath)

        event.sender.send('wrote-pdf', pdfPath)
      })
    })
  }

}