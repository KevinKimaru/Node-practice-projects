var main = require('./handlers/main.js');
// var rest = require('connect-rest');

module.exports = function(app) {
    app.get('/', main.home);
    app.get('/error', main.error);
    // app.get('/cart/checkout', main.cartCheckoutGet);
    // app.post('/cart/checkout', main.cartCheckoutPost);
    app.post('/contest/vacation-photo/:year/:month', main.contestVacationPhotoPost);
    app.get('/contest/vacation-photo/entries', main.contestVacationPhotoGet);
    app.get('/newsletter', main.newsletter);
    app.post('/process', main.process);
    app.get('/thankyou', main.thankyou);
    app.get('headers', main.headers);
    app.get('/about', main.about);
    app.get('/vacations', main.vacations);
    app.get('/notify-me-when-in-season', main.notifyInSeasonGet);
    app.post('/notify-me-when-in-season', main.notifyInSeasonPost);
    app.get('/set-currency/:currency', main.setCurrency);

    //apis
    app.use('/api', require('cors')());
    app.get('/api/attractions', main.getAttractionsApi);
    app.post('/api/attraction', main.addAttractionsApi);
    app.get('/api/attraction/:id', main.getIdAttractionApi);

    // rest.get('/api/attractions', main.getAttractionsApi);
    // rest.post('/api/attraction', main.addAttractionsApi);
    // rest.get('/api/attraction/:id', main.getIdAttractionApi);
    //
    // var apiOptions = {
    //   context: '/api',
    //   domain: require('domain').create(),
    // };
    //
    // app.use(rest.rester(apiOptions));
    //
    // apiOptions.domain.on('error', function(err){
    //    console.log('API domain error.\n', err.stack);
    //    setTimeout(function(){
    //      console.log('Server shutting down after API domain error.');
    //      process.exit(1);
    //    }, 5000);
    //    server.close();
    //    var worker = require('cluster').worker;
    //    if(worker) worker.disconnect();
    //  });

    app.use(main.err404);
    app.use(main.err500);

};
