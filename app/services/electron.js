import Ember from 'ember'
import RSVP from 'rsvp'

const GLOBAL_PATH = 'global-path'

export default Ember.Service.extend({
  globalPathIsSetup: false,

  passwordIsSetup: false,

  isAuthenticated: true,

  appIsReady: Ember.computed.and('globalPathIsSetup', 'passwordIsSetup'),

  showHeader: Ember.computed.and('appIsReady', 'isAuthenticated'),

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

  async checkSetup () {
    const globalPath = this.getGlobalPath()

    try {
      const setupData = await this.fetch('configuration:checkSetup', {globalPath})
      Ember.setProperties(this, setupData)
    } catch (error) {
      Ember.Logger.error(error)
    }
  },

  async setupGlobalPath (globalPath) {
    this.setGlobalPath(globalPath)

    try {
      const setupData = await this.fetch('configuration:setupGlobalPath', { globalPath })
      Ember.setProperties(this, setupData)
    } catch (error) {
      Ember.set(this, 'globalPathIsSetup', false)
      Ember.Logger.error(error)
    }
  },

  async _checkPassword (password, method, key) {
    try {
      await this.fetch(`configuration:${method}`, { password: window.btoa(password) })
      Ember.set(this, key, true)
    } catch (error) {
      Ember.set(this, key, false)
      Ember.Logger.error(error)
      return error
    }
  },

  setupPassword (password) {
    return this._checkPassword (password, 'setupPassword', 'passwordIsSetup')
  },

  checkAuth (password) {
    return this._checkPassword (password, 'checkPassword', 'isAuthenticated')
  }
});
