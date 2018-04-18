var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var data = [{item: 'buy book'}, {item: 'buy pen'}, {item: 'win book'}];

module.exports = function(app) {

  app.get('/todo', function(req, res) {
    res.render('todo', {data: data});
  });

  app.post('/todo', urlencodedParser, function(req, res) {
    console.log(req.body);
    data.push(req.body);
    res.json(data);
  });

  app.delete('/todo/:name', function(req, res) {
    data = data.filter(function(todo) {
      return todo.item.replace(/ /g, '-') !== req.params.name;
    });
    res.json(data);
  });

};
