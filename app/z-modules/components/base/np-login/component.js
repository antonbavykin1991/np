import Ember from 'ember';

export default Ember.Component.extend({
  isError: false,

  onSubmit (password) {},

  async checkAuth (password) {
    try {
      const isError = await this.onSubmit(password)

      if (isError) {
        Ember.set(this, 'isError', !!isError)
      }
    } catch (error) {
      Ember.set(this, 'isError', true)
    }
  }
});
