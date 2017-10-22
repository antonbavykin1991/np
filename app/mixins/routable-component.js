import Ember from 'ember';

export default Ember.Mixin.create({
  // TODO: use templateName
  renderTemplate(controller) {
    const routeName = this.get('routeName')
    const controllerQueryParams = this.get('controllerQueryParams')
    const componentName = `${routeName}-route`.replace(/\./g, '-route/')

    controller.reopen({
      queryParams: controllerQueryParams
    })

    controller.set('componentName', componentName);

    this.render(`routable-component`, {
      controller
    })
  }
})