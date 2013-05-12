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
    this.$el.find('.guide').remove();
    if (!localStorage.getItem('hasShowState') && isFinite(orientation)) {
      this.$el.append('<p class="guide state-guide">横置手机查看进度！（请打开重力感应）</p>');
    }
  },
  onRotate: function(orientation) {
    if (Math.abs(orientation) === 90 && this.$el.is(':visible')) {
      this.$el.hide();
    }
    else if (orientation === 0 && this._isActive) {
      this.$el.show();
    }
    if (localStorage.getItem('hasShowState') === 'true') {
      this.$el.find('.guide').remove();
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

    if (this.collection.length == 0) {
      this.$el.append('<p class="guide add-guide">你希望通过一万小时的练习成为哪个领域的专家？点击添加！</p>');
    }
    else if (!this.collection.hasRecords()) {
      this.$el.append('<p class="guide count-guide">点击开始计时！</p>');
    }
    else if (!localStorage.getItem('hasShowState') && isFinite(orientation)) {
      this.$el.append('<p class="guide state-guide">横置手机查看进度！（请打开重力感应）</p>');
    }

    this.listenTo(app.Event, app.Event.AddTask, function() {
      this.$el.find('.guide').remove();
      this.$el.find('.check-process').remove();
      this.$el.append('<p class="guide count-guide">点击开始计时！</p>');
      if (!isFinite(window.orientation)) {
        this.$el.append('<button class="check-process">Check Process</button>');
        this.$el.find('.check-process').on('click', function() {
          app.Event.trigger(app.Event.Rotate, 90);
        });
      }
    });

    if (!isFinite(window.orientation)) {
      this.$el.append('<button class="check-process">Check Process</button>');
      this.$el.find('.check-process').on('click', function() {
        app.Event.trigger(app.Event.Rotate, 90);
      });
    }
  }
});