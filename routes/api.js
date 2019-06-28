// DEPENDENCIES
var express = require('express');
var router = express.Router();

const axios = require('axios');
const instance = axios.create({
	baseURL: 'http://localhost:3080/api'
});

// CONFIG DATA
var config = require('../data/config.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({
		'methods': [
			'/api/envs',
			'/api/dus',
			'/api/dus/:du?env',
			'/api/products',
			'/api/tokens',
			'/api/tests/:env/:product'
		]
	}));
});

// Returns the list of environments in the configuration
router.get('/envs', function (req, res, next) {
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({
		'envs': {
			'list': Object.keys(config.envs), 
			'count': Object.keys(config.envs).length
		} 
	}));
});

// Returns the list of servers in the configuration
router.get('/servers', function (req, res, next) {
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({
		'servers': {
			'list': Object.keys(config.servers),
			'count': Object.keys(config.servers).length
		}
	}));
});

/* Needs to be refactored to the new variable names */
// router.get('/dus/:du', function (req, res, next) {
// 	var du = req.params.du;
// 	var env;

// 	if ( !config.dus[du] ) {
// 		res.status(404);
// 		res.send('ERROR: ' + du + ' is not defined');
// 	} else {

// 		var products = config.productsByDu(du);
// 		var hostname;
// 		var productsEndpoint = '/products?du=' + du;

// 		if ( req.query.env ) {
// 			env = req.query.env;
// 			if ( !config.envs.includes(env) ) {
// 				res.status(404);
// 				res.send('ERROR: ' + env + ' is not defined');
// 			} else {
// 				hostname = config.hostname(env, du);
// 				productsEndpoint += '&env=' + env; 
// 			}
// 		} 

// 		instance({
// 			url: productsEndpoint
// 		}).then(function (response) {
// 			res.set('Content-Type', 'application/json');
// 			res.send(JSON.stringify({
// 				'name': (config.dus[du].name) ? config.dus[du].name : du,
// 				'type': config.dus[du].type,
// 				'hostname': hostname,
// 				'products': response.data.products
// 			}));
// 		}).catch( function(error) {
// 			res.set('Content-Type', 'application/json');
// 			res.send(JSON.stringify({
// 				'name': (config.dus[du].name) ? config.dus[du].name : du,
// 				'type': config.dus[du].type,
// 				'hostname': hostname
// 			}));
// 		});

// 	}
	
// });

function genProductUrl (product, env, test, timeout) {
	var url = '/products/' + product + '?env=' + env;
	if (test) {
		url += '&test=true';
	}
	if ( Number.isInteger( Number(timeout) ) ) {
		url += '&timeout=' + Number(timeout);
	}
	return url;
}

router.get('/products', function (req, res, next) {
	res.set('Content-Type', 'application/json');
	var du = req.query.du;
	var env = req.query.env;
	var products = config.products2(env);

	var test = req.query.test;
	var timeout = req.query.timeout;
	
	if ( du ) {
		if ( !config.dus[du] ) {
			res.status(404);
			res.send('ERROR: ?du=' + du + ' is not defined');
		} else {
			products = config.productsByDu(du);
		}
	}

	if ( env ) {
		if ( !config.envs.includes(env) ) {
			res.status(404);
			res.send('ERROR: ?env=' + env + ' is not defined');
		} else {

			var count = 0;
			var details = {};
			var tests = {};
			
			tests.passed = [];
			tests.failed = [];
			tests.timeout = [];

			var getProductDetails = new Promise( function(resolve, reject) {
				
				products.forEach( function(product) {
					instance({
						// url: ( (req.query.test == 'true') ? '/products/' + product + '?env=' + env + '&test=true' : '/products/' + product + '?env=' + env )
						url: genProductUrl(product, env, test, timeout)
					}).then( function(response) {
						
						if ( test ) {
							if ( response.data.test.statusCode == 2 ) {
								tests.passed.push(product);
							} else if ( response.data.test.statusCode == 10 ) {
								tests.timeout.push(product);
							} else {
								tests.failed.push(product);
							}
						}

						details[product] = response.data;
						count ++;
						if (count >= products.length) resolve();
					}).catch( function(error) {
						count ++;
						if (count >= products.length) resolve();
					});
				});

			}).then( function() {
				var results;
				var total = tests.passed.length + tests.failed.length + tests.timeout.length
				if (test) {
					results =  {
						'total': total,
						'summaryStatus': (tests.passed.length >= products.length) ? 'green' : 'red',
						'passed': {
							'count': tests.passed.length,
							'list': tests.passed
						},
						'failed': {
							'count': tests.failed.length,
							'list': tests.failed
							
						},
						'timeout': {
							'count': tests.timeout.length,
							'list': tests.timeout
						}
					}
				}

				res.send(JSON.stringify({
					'du': du,
					'test': results,
					'products': {
						'list': products,
						'count': products.length
					},
					'details': details	
				}));
			}).catch( function(error) {
				console.log(error);
				res.send(JSON.stringify({
					'du': du,
					'products': {
						'list': products,
						'count': products.length
					}
				}));
			})

		}
	} else {
		res.send(JSON.stringify({
			'du': du,
			'products': {
				'list': products,
				'count': products.length
			}
		}));
	}

});

router.get('/products/:product', function (req, res, next) {
	var product = req.params.product;
	var env = req.query.env;
	var test = req.query.test;
	var timeout = 7500;

	if( Number.isInteger( Number(req.query.timeout) ) ) {
		timeout = Number(req.query.timeout);
	}

	if ( !config.products[product] ) {
		res.status(404);
		res.send('ERROR: ' + product + ' is not defined');
	} else {
		
		var url, hostname;
		var du = config.products[product].du;
		if ( env ) {
			if ( !config.envs.includes(env) ) {
				res.status(404);
				res.send('ERROR: ' + env + ' is not defined');
			} else {
				url = config.baseUrl(env, product);
				hostname = config.hostname(env, du);

				if ( test == 'true' ) {

					var getTest = new Promise( function(resolve, reject) {
						var data = {};
						instance({
							url: '/tests/' + env + '/' + product
						}).then( function(response) {
							getTest = response.data;
							resolve(getTest);
						}).catch( function(error) {
							resolve({
								'statusCode': 0,
								'statusLabel': config.statusLabel[0]
							});
						})

						setTimeout( function() {
							resolve({
								'statusCode': 10,
								'statusLabel': config.statusLabel[10],
								'details': {
									'timeout': timeout
								}
							});
						}, timeout)

					}).then( function(getTest) {
						res.set('Content-Type', 'application/json');
						res.send(JSON.stringify({
							'name': (config.products[product].name) ? config.products[product].name : product,
							'type': config.productType(product), 
							'du': du,
							'hostname': hostname,
							'url': url,
							'test': getTest
						}));
					}).catch( function(error) {
						res.set(500);
						res.send('ERROR: Something went wrong');
					});


				} else {
					res.set('Content-Type', 'application/json');
					res.send(JSON.stringify({
						'name': (config.products[product].name) ? config.products[product].name : product,
						'type': config.productType(product), 
						'du': du, 
						'hostname': hostname,
						'url': url
					}));
				}
			}
		} else {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({
				'name': (config.products[product].name) ? config.products[product].name : product,
				'type': config.productType(product),
				'du': du, 
				'hostname': hostname,
				'url': url
			}));
		}
	}
});

router.get('/tests/:env/:app', function(req, res, next) {
	var env = req.params.env;
	var app = req.params.app;

	if( !config.apps[app] || !config.envs[env] ) {
		res.status(404);
		res.send('ERROR: Not found');
	} else {
		var data = {
			'baseUrl': config.baseUrl(env, app),
			'statusCode': 0
		};

		switch ( config.serverType(app) ) {
			case 'node-app':
				instance({
					url: data.baseUrl
				}).then( function(response) {
					if (response.status == 200) {
						data.statusCode = 2;
						data.statusLabel = config.statusLabel[data.statusCode];
					} else {
						data.statusCode = 0;
						data.statusLabel = config.statusLabel[data.statusCode];
					}
					data.details = {
						'status': response.status
					}
					res.set('Content-Type', 'application/json');
					res.send(data);
				}).catch( function(error) {
					data.statusCode = 0;
					data.statusLabel = config.statusLabel[data.statusCode];
					data.details = {
						'status': error.response.status,
						'message': error.response.data
					}
					res.set('Content-Type', 'application/json');
					res.send(data);
				});

				break;

			// case 'api-java':
			// 	instance({
			// 		method: 'get',
			// 		url: '/tokens'
			// 	}).then(function (response){
			// 		var token = response.data.token_type + ' ' + response.data.access_token;
			// 		instance({
			// 			url: data.baseUrl + '/health-check',
			// 			headers: {
			// 				'Authorization': token
			// 			}
			// 		}).then( function(response) {
			// 			if (response.status == 200) {
			// 				data.statusCode = 2;
			// 				data.statusLabel = config.statusLabel[data.statusCode];
			// 				data.version = response.data.version;
			// 			} else {
			// 				data.statusCode = 0;
			// 				data.statusLabel = config.statusLabel[data.statusCode];
			// 			}
			// 			data.details = {
			// 				'status': response.status,
			// 				'message': response.data
			// 			}

			// 			res.set('Content-Type', 'application/json');
			// 			res.send(data);
			// 		}).catch( function(error) {
			// 			data.statusCode = 0;
			// 			data.statusLabel = config.statusLabel[data.statusCode];
			// 			data.details = {
			// 				'status': error.response.status,
			// 				'message': error.response.data
			// 			}

			// 			res.set('Content-Type', 'application/json');
			// 			res.send(data);
			// 		});

			// 	}).catch(function (error) {
			// 		//console.log(error);
			// 		res.status(500);
			// 		res.send('Error: Unexpected error');
			// 	});
			// 	break;

			// case 'gw':
			// 	instance({
			// 		url: data.baseUrl + '/ping',
			// 	}).then(function (response){
			// 		var status = 0;
			// 		switch (response.data) {
			// 			case 1:
			// 				status = 1;
			// 				break;
			// 			case 2:
			// 				status = 2;
			// 				break;
			// 		}

			// 		data.statusCode = status;
			// 		data.statusLabel = config.statusLabel[status];
			// 		data.details = response.data;

			// 		// if the server is up, get the version
			// 		if (status == 2) {
			// 			instance({
			// 				url: '/tests/gwVersion/' + env + '/' + product
			// 			}).then( function(response) {
			// 				data.version = response.data.version;

			// 				res.set('Content-Type', 'application/json');
			// 				res.send(data);
			// 			}).catch( function(error) {
			// 				res.set('Content-Type', 'application/json');
			// 				res.send(data);
			// 			});
			// 		} else {
			// 			res.set('Content-Type', 'application/json');
			// 			res.send(data);
			// 		}

			// 	}).catch(function (error){
			// 		data.statusCode = 0;
			// 		data.statusLabel = config.statusLabel[0];
			// 		data.details = error.response.data;

			// 		res.set('Content-Type', 'application/json');
			// 		res.send(data);
			// 	});
			// 	break;

			// case 'api-node':
			// 	instance({
			// 		url: '/tokens'
			// 	}).then(function (response){
			// 		var token = response.data.token_type + ' ' + response.data.access_token;
			// 		instance({
			// 			url: data.baseUrl + '/api/info',
			// 			headers: {
			// 				'Authorization': token
			// 			}
			// 		}).then( function(response) {
			// 			if (response.status == 200) {
			// 				data.statusCode = 2;
			// 				data.statusLabel = config.statusLabel[data.statusCode];
			// 				data.version = response.data.project.nodejs.projectVersion;
			// 			} else {
			// 				data.statusCode = 0;
			// 				data.statusLabel = config.statusLabel[data.statusCode];
			// 			}
			// 			data.details = {
			// 				'status': response.status,
			// 				'message': response.data
			// 			}

			// 			res.set('Content-Type', 'application/json');
			// 			res.send(data);
			// 		}).catch( function (error) {
			// 			data.statusCode = 0;
			// 			data.statusLabel = config.statusLabel[data.statusCode];
			// 			data.details = {
			// 				'status': error.response.status,
			// 				'message': error.response.data
			// 			}

			// 			res.set('Content-Type', 'application/json');
			// 			res.send(data);
			// 		});

			// 	}).catch(function (error) {
			// 		//console.log(error);
			// 		res.status(500);
			// 		res.send('Error: Unexpected error');
			// 	});
			// 	break;

			default:
				data.details = 'Health check not defined'

				res.set('Content-Type', 'application/json');
				res.send(data);
		}

	}
});

// function parseGwVersionResponse(response) {
// 	var str = String(response);

// 	if ( str.search('2.1') ) {
// 		str = str.substr( str.search('2.1'), 8 );
// 		str = str.trim();
// 		if ( str.indexOf('*') > 0 ) {
// 			str = str.substr( 0, str.indexOf('*') );
// 		}
// 		return str;
// 	} else if ( str.search('2.2') ) {
// 		str = str.substr( str.search('2.2'), 8 );
// 		str = str.trim();
// 		if ( str.indexOf('*') > 0 ) {
// 			str = str.substr( 0, str.indexOf('*') );
// 		}
// 		return str;
// 	} else {
// 		return null;
// 	}

// }

// router.get('/tests/gwVersion/:env/:app', function (req, res, next) {
// 	var env = req.params.env;
// 	var app = req.params.app;

// 	if( !config.envs.includes(env) ) {
// 		res.status(404);
// 		res.send('ERROR: env=' + env + ' is not defined');
// 	} else if ( !config.apps[app] || config.appType(app) != 'gw' ) {
// 		res.status(404);
// 		res.send('ERROR: app=' + app + ' is not defined');
// 	} else {
// 		var url = config.baseUrl(env, app);

// 		switch( app ) {
// 			case 'policy-center':
// 				url += '/PolicyCenter.do?inFrame=about';
// 				break;
// 			case 'billing-center':
// 				url += '/BillingCenter.do?inFrame=about';
// 				break;
// 			case 'contact-manager':
// 				url += '/ContactManager.do?inFrame=about';
// 				break;
// 		}

// 		axios.get(url).then(function (response) {
// 			res.set('Content-Type', 'application/json');
// 			res.send(JSON.stringify({
// 				'version': parseGwVersionResponse(response.data)
// 			}));
// 		}).catch(function (error) {
// 			res.status(500);
// 			res.send('ERROR: Something went wrong')
// 		})
// 	}
// });

module.exports = router;