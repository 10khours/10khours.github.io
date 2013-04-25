(function() {
  var _startAt;
  var DATE_FORMAT = 'YYYY-MM-DD';
  var minutesMax = 100 * 60;
  var hoursMax = minutesMax * 60;

  function secondsForOneDay() {
    return 24 * 60 * 60;
  }

  function handleRecords(records, stopAt) {
    if (records.length > 0) {
      var lastRecord = _.last(records);
      if (lastRecord.date === _startAt.format(DATE_FORMAT)) {
        lastRecord.time += stopAt.diff(_startAt, 'seconds');
      }
      else {
        records.push({
          date: _startAt.format(DATE_FORMAT),
          time: stopAt.diff(_startAt, 'seconds') + lastRecord.time
        });
      }
    }
    else {
      records = [
        {
          date: _startAt.format(DATE_FORMAT),
          time: stopAt.diff(_startAt, 'seconds')
        }
      ];
    }
    return records;
  }

  app.model.Task = Backbone.Model.extend({
    defaults: {
      'id': 0,
      'order': 0,
      'total': 0,
      'name': 'no name',
      'records': []
    },

    readableRecords: function() {
      var totalTime = this.get('total');
      var records = this.get('records');
      var result = [];
      if (totalTime > minutesMax && totalTime <= hoursMax) {
        _.each(records, function(record) {
          result.push(record.time / 60);
        });
      }
      else if (totalTime > hoursMax) {
        _.each(records, function(record) {
          result.push(record.time / 3600);
        });
      }
      else {
        _.each(records, function(record) {
          result.push(record.time);
        });
      }
      return result;
    },

    readableTimeWithUnit: function() {
      var totalTime = this.get('total');
      var unit = 'sec';

      if (totalTime > minutesMax && totalTime <= hoursMax) {
        totalTime = Math.floor(totalTime / 60);
        unit = 'min';
      }
      else if (totalTime > hoursMax) {
        totalTime = Math.floor(totalTime / 3600);
        unit = 'hours';
      }
      return {
        totalTime: totalTime,
        unit: unit
      };
    },

    start: function(startAt) {
      _startAt = startAt;
    },

    stop: function(stopAt) {
      var records = this.get('records');
      var total = this.get('total');
      if (!stopAt.isSame(_startAt, 'day')) {
        var endOfStartAtDay = _startAt.clone().endOf('day').add('second', 1);
        records = handleRecords(records, endOfStartAtDay);
        total += _.last(records).time;
        var fullDays = stopAt.diff(endOfStartAtDay, 'days');
        for (var i = 0; i < fullDays; i++) {
          total += secondsForOneDay();
          records.push({
            date: _startAt.clone().add('day', i + 1).format(DATE_FORMAT),
            time: total
          });
        }
        total += stopAt.diff(stopAt.clone().startOf('day'), 'seconds');
        records.push({
          date: stopAt.format(DATE_FORMAT),
          time: total
        });
      }
      else {
        records = handleRecords(records, stopAt);
        total = _.last(records).time;
      }
      this.set('records', records);
      this.set('total', total);
    }
  });
})();