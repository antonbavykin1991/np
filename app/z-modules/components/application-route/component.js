import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  dbIsLoaded: Ember.computed.reads('electron.dbIsLoaded'),

  passwordNeedSetup: Ember.computed.not('electron.passwordIsSetup'),

  showPasswordSetup: Ember.computed.and('dbIsLoaded', 'passwordNeedSetup'),

  appIsReady: Ember.computed.reads('electron.appIsReady')
});
