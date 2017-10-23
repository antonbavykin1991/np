import Ember from 'ember';

export default Ember.Component.extend({
  electron: Ember.inject.service(),

  password: null,

  passwordRepeat: null,

  isError: Ember.computed('password', 'passwordRepeat', function () {
    return Ember.get(this, 'password') !== Ember.get(this, 'passwordRepeat')
  }),

  onSubmit(password) {
    if (Ember.get(this, 'isError')) {
      return false
    }

    Ember.get(this, 'electron').setupPassword(password)
  }
});
