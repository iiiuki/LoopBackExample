'use strict';

module.exports = function(CoffeeShop) {
	CoffeeShop.status = function(cb) {
		var currentDate = new Date();
		var currentHour =  currentDate.getHours();
		var OPEN_HOUR = 6;
		var CLOSE_HOUR = 20;
		console.log('Current hour is %d', currentHour);
		var response;
		if (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR) {
			response = "We are open for business.";
		}else {
			response = "Sorry, we are closed. Open daily from 6 to 20.";
		}

		cb(null, response);
	};
	CoffeeShop.remoteMethod(
		'status', {
			http:{
				path: '/status',
				verb: 'get'
			},
			returns: {
				arg: 'status',
				type: 'string'
			}
		}
	);

	CoffeeShop.getName = function(shopId, cb){
		CoffeeShop.findById(shopId, function(err, instance){
			var reponse = "Name of coffee show is: " + instance.name;
			cb(null, reponse);
			console.log(reponse);
		});
	};

	CoffeeShop.remoteMethod (
        'getName',
        {
          http: {path: '/getname', verb: 'get'},
          accepts: {arg: 'idShop', type: 'number', http: { source: 'query' } },
          returns: {arg: 'name', type: 'string'}
        }
    );
};
