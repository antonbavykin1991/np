import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  print () {
    this.get('electron').fetch('checkAuth', {}).then((res) => {
      console.log(res)
    }).catch((e) => {
      console.log(e)
    })
  }
});
