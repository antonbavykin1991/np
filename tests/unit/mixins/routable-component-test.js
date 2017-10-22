import Ember from 'ember';
import RoutableComponentMixin from 'np/mixins/routable-component';
import { module, test } from 'qunit';

module('Unit | Mixin | routable component');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutableComponentObject = Ember.Object.extend(RoutableComponentMixin);
  let subject = RoutableComponentObject.create();
  assert.ok(subject);
});
