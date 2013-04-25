var app = {
  view: {},
  collection: {},
  model: {},
  colors: ['#6A8A62', '#F15A2A', '#6AAFCC', '#DAD23D']
};

app.Manager = (function() {
  var manager = function() {
    this.mainCollection = new app.collection.Tasks();
    this.mainCollection.fetch();
    this.mainCollection.completeData(moment());
    this.mainView = new app.view.Main({
      el: $('.app'),
      collection: this.mainCollection
    });
    this.loadTemplates();
  };

  manager.prototype.loadTemplates = function() {
    var mainView = this.mainView;
    $.get('template/main.html', function(template) {
      mainView.setTemplate(template);
      mainView.initViews();
    });
  };

  return manager;
})();