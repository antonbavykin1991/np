import Ember from 'ember'
import RSVP from 'rsvp'

export default Ember.Service.extend({
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
  }
});
