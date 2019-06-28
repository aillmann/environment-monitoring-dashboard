var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");

const axios = require('axios');
const api = axios.create({baseURL: 'http://localhost:3080/api'});

router.get('/reporting', function (req, res) {
	const directoryPath = path.join(__dirname, '../reporting');
	//passsing directoryPath and callback function
	fs.readdir(directoryPath, function (err, files) {
		//handling error
	    if (err) {
	        return console.log('Unable to scan directory: ' + err);
	    }

	    //listing all files using forEach    
	    res.render('reports',{
	    	files : files
	    });
	        
	});
});




/* GET home page. */
router.get('/', function(req, res, next) {
	api({
		method: 'get',
		url: '/envs'
	}).then( function(response) {
			
		res.render('index', { 
			title: 'The Dashboard',
			envs: response.data.envs
		});

	}).catch( function(error) {
		console.log(error);
		res.status(500);
		res.send('something went wrong');
	});
});



module.exports = router;