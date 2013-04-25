app.view.Chart = Backbone.View.extend({
  className: 'chart',
  render: function() {
    var labels = [];
    var dataInDataSets = this.model.readableRecords();
    var records = this.model.get('records');

    _.each(records, function(record) {
      labels.push(moment(record.date).format('MM-DD'));
    });
    var color = app.colors[this.model.get('order') - 1];
    var data = {
      labels: labels,
      datasets: [
        {
          fillColor: 'rgba(255,255,255,0.1)',
          strokeColor: color,
          pointColor: color,
          pointStrokeColor: '#333',
          data: dataInDataSets
        }
      ]
    };

    var scaleSteps = 5;
    var scaleTotal = (Math.floor(_.last(dataInDataSets) / 500) + 1) * 500;
    var scaleStepWidth = scaleTotal / scaleSteps;

    if (dataInDataSets.length === 1) {
      this._chart.Bar(data, {
        pointDot: false,
        scaleOverride: true,
        scaleSteps: scaleSteps,
        scaleStepWidth: scaleStepWidth,
        scaleStartValue: 0,
        barValueSpacing: 200
      });
    }
    else if (dataInDataSets.length > 1) {
      this._chart.Line(data, {
        pointDot: false,
        scaleOverride: true,
        scaleSteps: scaleSteps,
        scaleStepWidth: scaleStepWidth,
        scaleStartValue: 0
      });
    }
  },
  onSwitch: function(model) {
    this.model = model;
    this.render();
  },
  onRotate: function(orientation) {
    if (orientation === 0) {
      this.remove();
    }
  },
  initialize: function() {
    this.template = _.template($('#chart').html());
    this.$el.html(this.template());
    this.$chartContent = this.$el.find('.chart-content');
    var context = this.$chartContent[0].getContext('2d');
    this._chart = new Chart(context);
    this.render();
    this.listenTo(app.Event, app.Event.Switch, this.onSwitch);
    this.listenTo(app.Event, app.Event.Rotate, this.onRotate);
  }
});

