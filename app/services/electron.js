import Ember from 'ember'
import RSVP from 'rsvp'

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

  checkSetup () {
    this.fetch('configuration:checkSetup', {}).then((setupData) => {
      Ember.setProperties(this, setupData)
    }, (e) => {
      console.log(e)
    })
  },

  setupGlobalPath (folder) {
    this.fetch('configuration:setupGlobalPath', { folder }).then((setupData) => {
      Ember.setProperties(this, setupData)
    }, (e) => {
      console.log(e)
      Ember.set(this, 'globalPathIsSetup', false)
    })
  },

  setupPassword (password) {
    this.fetch('configuration:setupPassword', { password: window.btoa(password) }).then(() => {
      Ember.set(this, 'passwordIsSetup', true)
    }, (e) => {
      console.log(e)
      Ember.set(this, 'passwordIsSetup', false)
    })
  }
});
