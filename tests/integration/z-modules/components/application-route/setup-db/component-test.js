import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('application-route/setup-db', 'Integration | Component | application route/setup db', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{application-route/setup-db}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#application-route/setup-db}}
      template block text
    {{/application-route/setup-db}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
