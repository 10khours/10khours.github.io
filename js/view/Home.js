app.view.Home = Backbone.View.extend({
  _isActive: true,
  className: 'home',
  switchOut: function() {
    this.$el.hide();
    this._isActive = false;
  },
  switchIn: function() {
    this.$el.show();
    this._isActive = true;
  },
  onRotate: function(orientation) {
    if (Math.abs(orientation) === 90 && this.$el.is(':visible')) {
      this.$el.hide();
    }
    else if (orientation === 0 && this._isActive) {
      this.$el.show();
    }
  },
  initialize: function() {
    this.template = _.template($('#home').html());

    var taskListView = new app.view.TaskList({
      collection: this.collection
    });
    this.$el.append(this.template());
    this.$el.append(taskListView.$el);
    this.listenTo(app.Event, app.Event.TaskStart, this.switchOut);
    this.listenTo(app.Event, app.Event.TaskStop, this.switchIn);
    this.listenTo(app.Event, app.Event.Rotate, this.onRotate);
  }
});