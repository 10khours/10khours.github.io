app.view.Time = Backbone.View.extend({
  _isActive: false,
  _recorderTimer: null,
  className: 'time',
  events: {
    'click .stop': 'stopTask'
  },
  stopTask: function() {
    if (!this._isActive) return;
    _gaq.push(['_trackEvent', 'stop task']);
    this._isActive = false;
    this.model.stop(moment());
    this.model.save();
    this.$el.removeClass('task-order-' + this.model.get('order'));
    this.$el.hide();
    app.Event.trigger(app.Event.TaskStop);

    window.cancelAnimFrame(this._recorderTimer);
  },
  startTask: function(model) {
    if (this._isActive) return;
    _gaq.push(['_trackEvent', 'start task']);
    this._isActive = true;
    this.$el.html(this.template(model.attributes));
    this.$el.addClass('task-order-' + model.get('order'));
    this.$el.show();

    var startTime = moment();
    var color = app.colors[model.get('order') - 1];
    var $canvas = this.$el.find('.time-circle');
    var context = $canvas[0].getContext('2d');
    var centerX = $canvas.width() / 2;
    var centerY = $canvas.height() / 2;
    var lineWidth = 10;
    var radius = $canvas.width() === 0 ? 0 : $canvas.width() / 2 - lineWidth;
    var _ = this;

    context.font = '85px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = lineWidth;

    this._recorderTimer = null;
    this.model = model;
    this.model.start(startTime);

    displayTime();

    function displayTime(timestamp) {
      timestamp = timestamp || startTime.toDate().getTime();
      
      _._recorderTimer = window.requestAnimFrame(displayTime);
      var totalSeconds = (timestamp - startTime.toDate().getTime()) / 1000;
      var second = totalSeconds % 60;
      var minute = totalSeconds / 60;

      var secondDisplay = parseInt(second, 10).toString();
      var minuteDisplay = parseInt(minute, 10).toString();

      if (second < 10) {
        secondDisplay = '0' + secondDisplay;
      }
      if (minute < 10) {
        minuteDisplay = '0' + minuteDisplay;
      }

      context.clearRect(0, 0, $canvas.width(), $canvas.height());
      context.fillText(minuteDisplay + ':' + secondDisplay, centerX, centerY + 15);
      $canvas.text(minuteDisplay + ':' + secondDisplay);

      context.strokeStyle = '#343434';
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.stroke();

      context.strokeStyle = color;
      context.beginPath();
      context.arc(centerX, centerY, radius, - Math.PI / 2, - Math.PI / 2 + second / 30 * Math.PI, false);
      context.stroke();
    }
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
    this.template = _.template($('#time').html());
    this.$el.hide();
    this.listenTo(app.Event, app.Event.TaskStart, this.startTask);
    this.listenTo(app.Event, app.Event.Rotate, this.onRotate);
    var timeView = this;
    this.listenTo(app.router, 'route:home', function() {
      timeView.stopTask();
    });
  }
});