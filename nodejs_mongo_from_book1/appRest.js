var express = require('express'),
 bodyParser = require('body-parser'),
 _ = require('underscore'),
 json = require('./movies.json'),
 app = express();

app.set('port', process.env.PORT || 3500);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var router = new express.Router();

router.get('/test', function(req, res) {
  var data = {
    name: 'Kevin',
    age: 19
  };
  res.json(data);
});

router.get('/', function(req, res) {
  res.json(json);
});

router.post('/', function(req, res) {
  if(req.body.Id && req.body.Title && req.body.Director && req.body.Year && req.body.Rating) {
    json.push(req.body);
    res.json(json);
  } else {
    res.json(500, {error: 'There was an error!'});
  }
});

router.put('/:id', function(req, res) {
   // update the item in the collection
  if(req.params.id && req.body.Title && req.body.Director && req.body.Year && req.body.Rating) {
    _.each(json, function(elem, index) {
      // find and update:
      if(elem.Id === req.params.id) {
        elem.Title = req.body.Title;
        elem.Director = req.body.Director;
        elem.Year = req.body.Year;
        elem.Rating = req.body.Rating;
      }
    });
    res.json(json);
  } else {
    res.json(500, {error: 'There was an error!'});
  }
});

router.delete('/:id', function(req, res) {
  var indexToDel = -1;
  _.each(json, function(elem, index) {
    if (elem.Id === req.params.id) {
      indexToDel = index;
    }
  });
  if (~indexToDel) {
    json.splice(indexToDel, 1);
  }
  res.json(json);
});

app.use('/', router);

var server = app.listen(app.get('port'), function() {
  console.log('Express listening on port: ' + app.get('port'));
});
