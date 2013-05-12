app.Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'time/:id': 'time'
  },

  home: function() {
    app.Event.trigger(app.Event.Rotate, 0);
  },

  initialize: function() {
    var router = this;
    this.manager = new app.Manager();
    app.Event.on(app.Event.TaskStop, function() {
      router.navigate('/');
    });
    app.Event.on(app.Event.TaskStart, function(model) {
      router.navigate('time/' + model.get('id'));
    });
    app.Event.on(app.Event.Rotate, function(orientation) {
      if (orientation == 90 || orientation == -90) {
        router.navigate('/state');
      }
      else {
        router.navigate('/');
      }
    });
  }
});