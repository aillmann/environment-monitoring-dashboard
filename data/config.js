var config = {
	envs: {
        'sample': {
            'envPrefix': '',
            'apps': ['thisApp']
        }, 
        'dev': {
            'envPrefix': ''
        }, 
        'sit': {
            'envPrefix': ''
        }, 
        'uat': {
            'envPrefix': ''
        }
	},
	apps: {
		'thisApp': {
			'name': 'The Environment Dashboard',
			'server': 'thisServer',
			'pathTemplate': ''
		}
		
	},
	servers: {
		'thisServer': {
			'urlTemplate': 'localhost',
			'type': 'node-app'
		}

	},
	statusLabel: {
		2: "green",
		1: "yellow",
		0: "red",
		10: "timeout"
	},

	// Generates the base url of application, i.e. to call the app by url
	baseUrl: function(env, app) {
		var server = this.apps[app].server;
		var envPrefix = this.envs[env].envPrefix;
		var out;

		switch( this.serverType(app) ) {
			case 'node-app':
				out = 'http://' + envPrefix + this.servers[server].urlTemplate + ':3080' + this.apps[app].pathTemplate;
				break;

			default:
				out = null;
		}

		return out;
	},

	// Returns the server type of the application
	serverType: function(app) {
		try {
			var server = this.apps[app].server;
			return this.servers[server].type;
		} catch(err) {
			return null;
		}
	},

	// Returns the hostname of there server, i.e. to login to the server
	hostname: function(env, server) {
		try {
			hostname = this.envs[env].envPrefix + this.servers[server].urlTemplate;
			return hostname;
		} catch(err) {
			return null;
		}
	},

	// Returns the list of servers by type
	seversByType: function(type) {
		var servers = this.servers;
		var output = [];

		Object.keys(servers).forEach( function(server) {
			if (servers[server].type == type) {
				output.push(server);
			}
		});

		return output;
	},

	// Returns the list of applications deployed on each server
	appsByServer: function(server) {
		var apps = this.apps;
		var output = [];

		Object.keys(apps).forEach( function(app) {
			if (apps[app].server == server) {
				output.push(app);
			}
		});

		return output;
	}, 

	// Returns the list of applications for an environment
	appsByEnv: function(env) {
		if (env != undefined) {
			var apps = this.apps;
			var out = [];

			if (this.envs[env].apps != undefined) {
				return this.envs[env].apps;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

};

// Unit Tests
function testServerType() {
	var input = {
		'app': 'thisApp'
	};

	console.log('\n--- Testing serverType() ---');
	
	expected = 'node-app';
	test = config.serverType(input.app);

	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	if ( expected == test ) {
		console.log('PASSED\n');
		return 1;
	} else {
		console.log('FAILED\n');
		return 0;
	}
}

function testBaseUrl() {
	var input = {
		'env': 'sample',
		'app': 'thisApp'
	};

	console.log('\n--- Testing baseUrl() ---');
	
	expected = 'http://localhost:3080';
	test = config.baseUrl(input.env, input.app);

	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	if ( expected == test ) {
		console.log('PASSED\n');
		return 1;
	} else {
		console.log('FAILED\n');
		return 0;
	}
}

function testHostname() {
	var input = {
		'env': 'sample',
		'server': 'thisServer'
	};

	console.log('\n--- Testing hostname() ---');
	
	expected = 'localhost';
	test = config.hostname(input.env, input.server);

	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	if ( expected == test ) {
		console.log('PASSED\n');
		return 1;
	} else {
		console.log('FAILED\n');
		return 0;
	}
}

function testSeversByType() {
	var input = {
		'type': 'node-app',
	};

	console.log('\n--- Testing seversByType() ---');
	
	expected = ['thisServer'];
	test = config.seversByType(input.type);

	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	if ( expected[0] == test[0] ) {
		console.log('PASSED\n');
		return 1;
	} else {
		console.log('FAILED\n');
		return 0;
	}
}

function testAppsByServer() {
	var input = {
		'server': 'thisServer',
	};

	console.log('\n--- Testing appsByServer() ---');
	
	expected = ['thisApp'];
	test = config.appsByServer(input.server);

	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	if ( expected[0] == test[0] ) {
		console.log('PASSED\n');
		return 1;
	} else {
		console.log('FAILED\n');
		return 0;
	}
}

function testAppsByEnv() {
	var input = {
		'env': 'sample',
	};

	console.log('\n--- Testing appsByEnv() ---');
	
	expected = ['thisApp'];
	test = config.appsByEnv(input.env);

	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	if ( expected[0] == test[0] ) {
		console.log('PASSED\n');
		return 1;
	} else {
		console.log('FAILED\n');
		return 0;
	}
}

function runTests() {
	var results = {};
	results.passed = 0;
	results.failed = 0;

	( testServerType() ) ? results.passed++ : results.failed++; 
	( testBaseUrl() ) ? results.passed++ : results.failed++; 
	( testHostname() ) ? results.passed++ : results.failed++;
	( testSeversByType() ) ? results.passed++ : results.failed++;
	( testAppsByServer() ) ? results.passed++ : results.failed++;
	( testAppsByEnv() ) ? results.passed++ : results.failed++;

	console.log('\n--- UNIT TEST SUMMARY ----');
	console.log('TOTAL PASSED: ' + results.passed);
	console.log('TOTAL FAILED: ' + results.failed);
}

// runTests();

module.exports = config;