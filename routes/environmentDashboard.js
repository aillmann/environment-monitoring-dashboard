var express = require('express');
var router = express.Router();

const axios = require('axios');
const api = axios.create({baseURL: 'http://localhost:3080/api'});

/* GET home page. */
router.get('/:env', function(req, res, next) {
	api({
		method: 'get',
		url: '/apps?env=' + req.params.env
	}).then( function(response) {
			
		res.render('environmentDashboard', { 
			title: req.params.env,
			apps: response.data.apps
		});

	}).catch( function(error) {
		console.log(error);
		res.status(500);
		res.send('something went wrong');
	});
	
});

module.exports = router;