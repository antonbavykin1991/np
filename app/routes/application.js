import Ember from 'ember';
import RComponent from 'np/mixins/routable-component'

export default Ember.Route.extend(RComponent, {
  electron: Ember.inject.service(),

  beforeModel() {
    return Ember.get(this, 'electron').checkSetup()
  }
});
