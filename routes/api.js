var express = require('express');
var router = express.Router();

const axios = require('axios');
const instance = axios.create({baseURL: 'http://localhost:3080/api'});

var oracledb = require('oracledb');

var pingFedScope = 'gps.fin.cc.w gps.fin.cc.r api.mgmt.info.r gps.fin.fnevts.w gps.fin.cal.r gps.fin.dis.r gps.oir.csr.r gps.oir.csr.w gps.cif.prts.r gps.cif.prts.w gps.oir.atrp.r gps.oir.atrp.w gps.ap.acc.r gps.ra.affgrps.r gps.dm.dmagg.w gps.ra.cap.w gps.dm.corr.w gps.ra.ias.w gps.ra.iasl.w gps.oir.mvrr.r gps.oir.mvrr.w gps.fin.pde.w gps.ap.pol.r gps.ra.pxmd.w gps.ra.ragr.w gps.uae.cov.r gps.uae.cov.w gps.uae.eli.w gps.uae.eli.r gps.uae.lft.w gps.uae.lft.r gps.uae.wap.w gps.uae.wap.r gps.ap.licv.r gps.ra.oda.w gps.ap.prtf.r gps.ap.mtv.r gps.uae.cov.w gps.uae.cov.r gps.uae.eli.w gps.uae.eli.r gps.uae.lft.w gps.uae.lft.r gps.uae.wap.w gps.uae.wap.r gps.ubi.drv.r gps.ubi.drv.w gps.extr.bvsr.r gps.uae.dcln.w gps.uae.dcln.r gps.dis.bnkacc.r gps.dis.bnkacc.w gps.fin.blnginfo.r gps.dis.chqrec.disb.r gps.dis.chqrec.disb.w gps.claim.mnracc.r gps.uae.mvrnw.r gps.uae.mvrnw.w gsp.ga521gs.gsp.r rst.ga521rc.rst.r loc.ga521gar.loc.r cb.ga521.acr.r gps.uae.cusegmt.w gps.uae.cusegmt.r gps.uae.clqualif.w gps.uae.clqualif.r gps.uae.lgloss.w gps.uae.lgloss.r gps.uae.oiltank.w gps.uae.oiltank.r gps.uae.condcont.w gps.uae.condcont.r gps.uae.covres.w gps.uae.covres.r loc.ga521fp.loc.r';
var pingFedUrl = 'https://fed1.sys.tdbank.ca/as/token.oauth2?grant_type=client_credentials&client_id=TestScopeClient&client_secret=2Federate&scope=' + pingFedScope;

var testApiUrl = 'http://dev008.segmentation.ga251.api.dev.td.com:8080/coverage-offering-res/health-check';

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
			'list': config.envs, 
			'count': config.envs.length
		} 
	}));
});

/*router.get('/envs/summary', function (req, res, next) {
	var envs = config.envs;
	//var envs = ['dev009', 'sit006'];
	var count = 0;
	var timeout = req.query.timeout;

	var tests = {};
	tests.passed = [];
	tests.failed = [];

	var getSummary = new Promise( function (resolve, reject) {

		var url;
		var results = {};
		envs.forEach( function(env) {

			url = '/products?test=true' + '&env=' + env;
			if (timeout) url += '&timeout=' + timeout;

			instance({
				url: url
			}).then( function(response) {

				console.log(response.data.test.summaryStatus);

				if( response.data.test.summaryStatus == 'green' ) {
					results[env] = {
						'total': response.data.test.total,
						'totalPassed': response.data.test.passed.count,
						'summaryStatus': response.data.test.summaryStatus
					},
					tests.passed.push(env);
				} else {
					results[env] = {
						'total': response.data.test.total,
						'totalPassed': response.data.test.passed.count,
						'summaryStatus': response.data.test.summaryStatus, 
						'failed': response.data.test.failed, 
						'timeout': response.data.test.timeout
					},
					tests.failed.push(env);
				}

				count ++;
				if (count >= envs.length) resolve(results);
			}).catch( function(error) {
				res.send(error);
			});

		});

	}).then( function (results) {

		var response = {
			'summary': {
				'total': envs.length,
				'green': tests.passed.length,
				'red': {
					'count': tests.failed.length,
					'list': tests.failed
				}
			},
			'results': results, 
			'envs': {
				'list': envs, 
				'count': envs.length
			}			
		};

		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(response));

	}).catch( function (error)  {
		res.send(error);
	});

});*/

router.get('/dus', function (req, res, next) {
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({
		'dus': {
			'list': Object.keys(config.dus),
			'count': Object.keys(config.dus).length
		}
	}));
});

router.get('/dus/:du', function (req, res, next) {
	var du = req.params.du;
	var env;

	if ( !config.dus[du] ) {
		res.status(404);
		res.send('ERROR: ' + du + ' is not defined');
	} else {

		var products = config.productsByDu(du);
		var hostname;
		var productsEndpoint = '/products?du=' + du;

		if ( req.query.env ) {
			env = req.query.env;
			if ( !config.envs.includes(env) ) {
				res.status(404);
				res.send('ERROR: ' + env + ' is not defined');
			} else {
				hostname = config.hostname(env, du);
				productsEndpoint += '&env=' + env; 
			}
		} 

		instance({
			url: productsEndpoint
		}).then(function (response) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({
				'name': (config.dus[du].name) ? config.dus[du].name : du,
				'type': config.dus[du].type,
				'hostname': hostname,
				'products': response.data.products
			}));
		}).catch( function(error) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({
				'name': (config.dus[du].name) ? config.dus[du].name : du,
				'type': config.dus[du].type,
				'hostname': hostname
			}));
		});

	}
	
});

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

router.get('/tokens', function(req, res, next) {
	instance({
		method: 'post',
		url: pingFedUrl
	}).then(function (response){
		res.send(response.data);
	}).catch(function (error){
		res.status(500);
		res.send('Error: could not get token');
	});
});

router.get('/tests/:env/:product', function(req, res, next) {
	var env = req.params.env;
	var product = req.params.product;

	if( !config.products[product] || !config.envs.includes(env) ) {
		res.status(404);
		res.send('ERROR: Not found');
	} else {
		var data = {
			'baseUrl': config.baseUrl(env, product),
			'statusCode': 0
		};

		switch ( config.productType(product) ) {
			case 'api-java':
				instance({
					method: 'get',
					url: '/tokens'
				}).then(function (response){
					var token = response.data.token_type + ' ' + response.data.access_token;
					instance({
						url: data.baseUrl + '/health-check',
						headers: {
							'Authorization': token
						}
					}).then( function(response) {
						if (response.status == 200) {
							data.statusCode = 2;
							data.statusLabel = config.statusLabel[data.statusCode];
							data.version = response.data.version;
						} else {
							data.statusCode = 0;
							data.statusLabel = config.statusLabel[data.statusCode];
						}
						data.details = {
							'status': response.status,
							'message': response.data
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

				}).catch(function (error) {
					//console.log(error);
					res.status(500);
					res.send('Error: Unexpected error');
				});
				break;

			case 'gw':
				instance({
					url: data.baseUrl + '/ping',
				}).then(function (response){
					var status = 0;
					switch (response.data) {
						case 1:
							status = 1;
							break;
						case 2:
							status = 2;
							break;
					}

					data.statusCode = status;
					data.statusLabel = config.statusLabel[status];
					data.details = response.data;

					// if the server is up, get the version
					if (status == 2) {
						instance({
							url: '/tests/gwVersion/' + env + '/' + product
						}).then( function(response) {
							data.version = response.data.version;

							res.set('Content-Type', 'application/json');
							res.send(data);
						}).catch( function(error) {
							res.set('Content-Type', 'application/json');
							res.send(data);
						});
					} else {
						res.set('Content-Type', 'application/json');
						res.send(data);
					}

				}).catch(function (error){
					data.statusCode = 0;
					data.statusLabel = config.statusLabel[0];
					data.details = error.response.data;

					res.set('Content-Type', 'application/json');
					res.send(data);
				});
				break;

			case 'api-node':
				instance({
					url: '/tokens'
				}).then(function (response){
					var token = response.data.token_type + ' ' + response.data.access_token;
					instance({
						url: data.baseUrl + '/api/info',
						headers: {
							'Authorization': token
						}
					}).then( function(response) {
						if (response.status == 200) {
							data.statusCode = 2;
							data.statusLabel = config.statusLabel[data.statusCode];
							data.version = response.data.project.nodejs.projectVersion;
						} else {
							data.statusCode = 0;
							data.statusLabel = config.statusLabel[data.statusCode];
						}
						data.details = {
							'status': response.status,
							'message': response.data
						}

						res.set('Content-Type', 'application/json');
						res.send(data);
					}).catch( function (error) {
						data.statusCode = 0;
						data.statusLabel = config.statusLabel[data.statusCode];
						data.details = {
							'status': error.response.status,
							'message': error.response.data
						}

						res.set('Content-Type', 'application/json');
						res.send(data);
					});

				}).catch(function (error) {
					//console.log(error);
					res.status(500);
					res.send('Error: Unexpected error');
				});
				break;

			/*
			case 'db':
				var password = master.databasePasswords(product, env);

				async function test() {
					let connection;

					try {
						connection = await oracledb.getConnection( {
							user: product, 
							password: password, 
							connectString: data.baseUrl
						});
						connection.callTimeout = 5000;

						let  result = await connection.execute(`SELECT COUNT(table_name) FROM user_tables`);

						var numTables = result.rows[0][0];

						if (numTables > 0) {
							data.statusCode = 2;
							data.statusLabel = config.statusLabel[data.statusCode];
						} else {
							data.statusCode = 0;
							data.statusLabel = config.statusLabel[data.statusCode];
						}
						data.version = 'n/a';
						data.details = {
							'message': 'Connection Successful: ' + numTables + ' tables in ' + product
						}

						res.set('Content-Type', 'application/json');
						res.send(data);
					} catch (err) {
						console.log(err);
						data.statusCode = 0;
						data.statusLabel = config.statusLabel[data.statusCode];
						data.version = 'n/a';
						data.details = {
							'message': 'Connection Failed' 
						}

						console.log('Failed to connect to: ' + data.baseUrl);

						res.set('Content-Type', 'application/json');
						res.send(data);
					} finally {
						if (connection) {
							try {
								await connection.close();
							} catch (err) {
								console.log(err);
								data.statusCode = 0;
								data.statusLabel = config.statusLabel[data.statusCode];
								data.version = 'n/a';
								data.details = {
									'message': 'Unexpected Error' 
								}

								res.set('Content-Type', 'application/json');
								res.send(data);
							}
						}
					}
				}
				test();
				break;
			*/

			default:
				data.details = 'Health check not defined'

				res.set('Content-Type', 'application/json');
				res.send(data);
		}

	}
});

function parseGwVersionResponse(response) {
	var str = String(response);

	if ( str.search('2.1') ) {
		str = str.substr( str.search('2.1'), 8 );
		str = str.trim();
		if ( str.indexOf('*') > 0 ) {
			str = str.substr( 0, str.indexOf('*') );
		}
		return str;
	} else if ( str.search('2.2') ) {
		str = str.substr( str.search('2.2'), 8 );
		str = str.trim();
		if ( str.indexOf('*') > 0 ) {
			str = str.substr( 0, str.indexOf('*') );
		}
		return str;
	} else {
		return null;
	}

}

// var res1 = '<html> <head> <title>About Guidewire PolicyCenter</title> <base href="http://sit011.policycenter.gpas.app.dev.td.com:8080/pc/resources/themes/Titanium/resources/"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta http-equiv="Cache-Control" content="no-cache"> <meta http-equiv="Pragma" content="no-cache"> <meta http-equiv="Expires" content="0"> <style> .about-text { font-family: Courier New, Courier, monotype; font-size: 11px; font-weight: normal; color: #47637E; } .preview-text { font-family: Courier New, Courier, monotype; font-size: 20px; font-weight: bold; color: #47637E; } </style> </head> <body class="about-body" bgcolor="#FFFFFF" topmargin="1" leftmargin="1" marginwidth="0" marginheight="0" link="#0000FF" alink="#0000FF" vlink="#0000FF"> <form action="About.do?inFrame=about" method="POST" name="about"> <img src="images/app/about-splash.png" > <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="position:absolute;top:0px;left:0px;z-index: 5"> <tr> <td width="100%" height="100%"> <!-- cover background image --> </td> </tr> </table> <div class="preview-text" style="position:absolute; left: 5px; bottom: 95px;z-index: 20"> <br> </div> <div class="about-text" style="position:absolute; left: 20px; bottom: 6px; top: 213px;z-index: 10"> Application Version: 8.0.7.437 <br> Platform Version: 8.27.0.437 <br> Schema Version: 603 <br> Server Instance: pcbatch1&nbsp;&nbsp;Config Env: prod <br> <b>Build Number:</b> </b>&nbsp;&nbsp;2.1.1425 </div> </form></body></html>';
// console.log(parseGwVersionResponse(res1));

router.get('/tests/gwVersion/:env/:product', function (req, res, next) {
	var env = req.params.env;
	var product = req.params.product;

	if( !config.envs.includes(env) ) {
		res.status(404);
		res.send('ERROR: env=' + env + ' is not defined');
	} else if ( !config.products[product] || config.productType(product) != 'gw' ) {
		res.status(404);
		res.send('ERROR: product=' + product + ' is not defined');
	} else {
		var url = config.baseUrl(env, product);

		switch( product ) {
			case 'policy-center':
				url += '/PolicyCenter.do?inFrame=about';
				break;
			case 'billing-center':
				url += '/BillingCenter.do?inFrame=about';
				break;
			case 'contact-manager':
				url += '/ContactManager.do?inFrame=about';
				break;
		}

		axios.get(url).then(function (response) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({
				'version': parseGwVersionResponse(response.data)
			}));
		}).catch(function (error) {
			res.status(500);
			res.send('ERROR: Something went wrong')
		})
	}
});

module.exports = router;