import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('application-route/setup-password', 'Integration | Component | application route/setup password', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{application-route/setup-password}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#application-route/setup-password}}
      template block text
    {{/application-route/setup-password}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
