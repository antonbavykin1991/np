import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  globalPathIsSetup: Ember.computed.reads('electron.globalPathIsSetup'),

  passwordNeedSetup: Ember.computed.not('electron.passwordIsSetup'),

  showPasswordSetup: Ember.computed.and('globalPathIsSetup', 'passwordNeedSetup'),

  appIsReady: Ember.computed.reads('electron.appIsReady'),

  showHeader: Ember.computed.reads('electron.showHeader')
});
