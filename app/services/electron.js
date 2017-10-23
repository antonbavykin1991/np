import Ember from 'ember'
import RSVP from 'rsvp'

const GLOBAL_PATH = 'global-path'

export default Ember.Service.extend({
  globalPathIsSetup: false,

  passwordIsSetup: false,

  appIsReady: Ember.computed.and('globalPathIsSetup', 'passwordIsSetup'),

  electron: Ember.computed(function () {
    return window.require("electron")
  }),

  ipcRenderer: Ember.computed.reads('electron.ipcRenderer'),

  fetch(eventName, data) {
    const ipcRenderer = this.get('ipcRenderer')

    return new RSVP.Promise((success, reject) => {
      ipcRenderer.once(`${eventName}-responce`, (event, result) => {
        if (result.isError) {
          return reject(result)
        }

        success(result)
      })

      const params = Object.assign({}, {eventName}, data)

      ipcRenderer.send('message', params)
    })
  },

  getGlobalPath () {
    return window.localStorage.getItem(GLOBAL_PATH)
  },

  setGlobalPath (globalPath) {
    window.localStorage.setItem(GLOBAL_PATH, globalPath)
  },

  checkSetup () {
    const globalPath = this.getGlobalPath()

    this.fetch('configuration:checkSetup', {globalPath}).then((setupData) => {
      Ember.setProperties(this, setupData)
    }, (error) => {
      Ember.Logger.error(error)
    })
  },

  setupGlobalPath (globalPath) {
    this.setGlobalPath(globalPath)

    this.fetch('configuration:setupGlobalPath', { globalPath }).then((setupData) => {
      Ember.setProperties(this, setupData)
    }, (error) => {
      Ember.set(this, 'globalPathIsSetup', false)
      Ember.Logger.error(error)
    })
  },

  setupPassword (password) {
    this.fetch('configuration:setupPassword', { password: window.btoa(password) }).then(() => {
      Ember.set(this, 'passwordIsSetup', true)
    }, (error) => {
      Ember.set(this, 'passwordIsSetup', false)
      Ember.Logger.error(error)
    })
  }
});
