var mongodb = require('mongodb');

var mongoClient = mongodb.MongoClient;

mongoClient.connect('mongodb://127.0.0.1:27017/mongotest', function(err, db) {
  console.log('Connected to mongodb');

  var collection = db.collection('testing');

  collection.insert({'title': 'Hello world'}, function(err, docs) {
    console.log(docs.ops.length + ' records inserted.');
    console.log(docs.ops[0].title + ' - ' + docs.ops[0]._id);

    collection.findOne({title: 'Hello world'}, function(err, doc) {
      console.log(doc._id + ' - ' + doc.title);
      db.close();
    });

  });
});
