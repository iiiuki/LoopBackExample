var async = require('async');
module.exports = function(app) {
  // app.dataSources.mysqlDs.automigrate('CoffeeShop', function(err) {
  //   if (err) throw err;

  //   app.models.CoffeeShop.create([{
  //     name: 'Twitbean cafe',
  //     city: 'Duy Tan'
  //   }, {
  //     name: 'Highlands Coffee',
  //     city: 'Duy Tan'
  //   }, {
  //     name: 'Starbung coffee',
  //     city: 'Duy Tan'
  //   }], function(err, coffeeShops) {
  //     if (err) throw err;

  //     console.log('Models created: \n', coffeeShops);
  //   });
  // });
  
  //data sources
  var mongoDs = app.dataSources.mongoDs;
  var mysqlDs = app.dataSources.mysqlDs;

  //create all models
  async.parallel(
    {
      reviewers: async.apply(createReviewer),
      coffeeShops: async.apply(createCoffeeShops)
    }, function(err, results){
      if (err) {throw err;}
      createReviews(results.reviewers, results.coffeeShops, function(err){
        console.log('> models created sucessfully');
      });
    }
  );

  //Create reviewers
  function createReviewer(cb){
    mongoDs.automigrate("Reviewer", function(err){
      if (err) {throw err;}
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {
          email: 'hiep1@hiep.com',
          password: 'hiep1'
        },
        {
          email: 'hie2@hiep.com',
          password: 'hiep2'
        },
        {
          email: 'hiep3@hiep.com',
          password: 'hiep3'
        }
      ],cb);
    });
  }

  //Create coffee shops
  function createCoffeeShops(cb){
    mysqlDs.automigrate('CoffeeShop', function(err){
      if (err) { throw err; }
      var CoffeeShop = app.models.CoffeeShop;
      CoffeeShop.create([
        {
          name: 'Twitbean cafe',
          city: 'Duy Tan'
        },
        {
          name: 'Highlands Coffee',
          city: 'Duy Tan'
        },
        {
          name: 'Starbung coffee',
          city: 'Duy Tan'
        }
      ], cb);
    });
  }

  //Create revies
  function createReviews(reviewers, coffeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          coffeeShopId: coffeeShops[0].id,
        }, 
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[0].id,
        }, 
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[1].id,
        }, 
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          coffeeShopId: coffeeShops[2].id,
        }
      ], cb);
    });
  }


};