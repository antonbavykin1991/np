import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  routing: Ember.inject.service('_routing'),

  async onSubmit(password) {
    try {
      const IsError = !!(await Ember.get(this, 'electron').checkAuth(password))

      if (!IsError) {
        await this.get('routing').transitionTo('index')
      } else {
        return IsError
      }
    } catch (error) {
      console.log(error)
    }
  }
});
