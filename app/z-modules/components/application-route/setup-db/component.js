import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  folder: null,

  onChange (event) {
    const folder = event.target.files[0].path
    Ember.set(this, 'folder', folder)
  },

  onSubmit (folder) {
    if (!folder) {
      return false
    }

    Ember.get(this, 'electron').setupDB(...arguments)
  }
});
