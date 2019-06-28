var express = require('express');
var router = express.Router();

const axios = require('axios');
const api = axios.create({baseURL: 'http://localhost:3080/api'});

/* GET home page. */
router.get('/:product', function(req, res, next) {
	var product = req.params.product;
	var env = req.query.env;

	var url = '/products/' + product;
	if (env) url += '?test=true&env=' + env;

	api({
		url: url
	}).then( function(response) {
			
		res.render('product', { 
			title: product,
			data: JSON.stringify(response.data, null, 4), 
			rawData: response.data
		});

	}).catch( function(error) {
		console.log(error);
		res.status(500);
		res.send('something went wrong');
	});
});

module.exports = router;