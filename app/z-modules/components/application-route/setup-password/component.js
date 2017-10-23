import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  password: null,

  passwordRepeat: null,

  isError: Ember.computed('password', 'passwordRepeat', function () {
    const {
      password,
      passwordRepeat
    } = Ember.getProperties(this, 'password', 'passwordRepeat')

    return !password || (password !== passwordRepeat)
  }),

  onSubmit(password) {
    if (Ember.get(this, 'isError')) {
      return false
    }

    Ember.get(this, 'electron').setupPassword(password)
  }
});
