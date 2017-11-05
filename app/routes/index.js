import Ember from 'ember';
import RComponent from 'np/mixins/routable-component'

export default Ember.Route.extend(RComponent, {
  electron: Ember.inject.service(),

  isAuthenticated: Ember.computed.reads('electron.isAuthenticated'),

  beforeModel () {
    if (!Ember.get(this, 'isAuthenticated')) {
      return this.transitionTo('login')
    }
  }
});
