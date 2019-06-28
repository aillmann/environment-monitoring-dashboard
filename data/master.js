var fs = require('fs');

/* Note: mater.json has been deprecated, need to remove refrences to master.json */
var filePath, master;
try { 
	filePath = '/home/marinl7/com-td-tdi-devops-data/master.json';
	master = JSON.parse( fs.readFileSync(filePath) );
} catch (err) {
	try { 
		filePath = 'C:/Code/Node/dashboard/com-td-tdi-devops-data/master.json';
		master = JSON.parse( fs.readFileSync(filePath) );
	} catch (err) {
		console.log('ERROR: Could not load master file');
	}
}

var config = {

	products: function(platform) {
		var products = [];
		Object.keys(master).forEach( function(n) {
			if (n != 'tag-modes' && n != 'mappings' && n != 'globals' && n != 'deployable-units' && n != 'data') {
				products.push(n);
			}
		});
		
		if (platform) {
			var filtered = [];
			products.forEach( function(product) {
				if( master[product].platform == platform ) {
					filtered.push(product);
				}
			});
			return filtered.sort();
		} else {
			return products.sort();
		}
		
	}, 

	productMeta: function(product) {
		var details = {};
		details.envs = [];

		if ( master[product] ) {

			Object.keys( master[product].environments ).forEach( function(env) {
				if ( !env.includes('template') ) {
					details.envs.push(env);
				}
			});

			details.envs.sort();
			return details;

		}
	},

	productDetails: function(product, env) {
		var details = {};
		details.envs = [];

		if ( master[product] ) {

			if ( master[product].environments[env] ) {

				return master[product].environments[env];

			}

		}
	},

	dus: function() {
		var dus = [];
		return Object.keys(master['deployable-units']);
	}, 

	duMeta: function(du) {
		var details = {};
		details.envs = [];

		if ( master['deployable-units'][du] ) {

			Object.keys( master['deployable-units'][du].environments ).forEach( function (env) {
				if ( !env.includes('template') ) {
					details.envs.push(env);
				}
			});

			details.envs.sort();
			return details;

		}
	},

	platforms: function() {
		var products = this.products();
		var platforms = [];
		products.forEach( function(product) {
			if ( !platforms.includes( master[product].platform ) && master[product].platform != undefined ) {
				platforms.push( master[product].platform );
			}
		});
		return platforms.sort();
	},

	globals: function(key, env) {
		try {
			return master['globals']['environments'][env][key]
		} catch (err) {
			return undefined;
		}
	}, 

	databasePasswords: function(schema, env) {
		try {
			switch(schema) {
				/* Guidewire DB */
				case 'GPAS_PCUSER':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-GPAS_PCUSER-password', env);
				case 'GBILL_BCUSER':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-GBILL_BCUSER-password', env);
				case 'G0071_ABUSER':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-G0071_ABUSER-password', env);
				case 'G0071_AUDUSER':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-G0071_AUDUSER-password', env);
				/* Policy Extension DB */
				case 'GDIG_DIGITIZATION':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-digitization-password', env);
				case 'GPAS_VICCUSER':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-vicc-password', env);
				case 'GA251_UAEMODEL':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-uaemodel-password', env);
				case 'GA521_EXTERNALREPORT':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-ga521-externalreport-password', env);
				case 'G0079_INSAUDIT':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-insbridge-audit-password', env);
				/* Billing Financials DB */
				case 'GRECV_BFINANCE':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-billing-financials-password', env);
				case 'GA441_CHEQUERECON':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-cheque-reconciliation-password', env);
				case 'GRECV_PDMUSER':
					return this.globals('_PLAIN_TEXT_SECRET_td-tdi-ddl-payments-disbursements-management-password', env);
				default:
					return undefined;
			}
		} catch (err) {
			return undefined;
		}
	}
};

//fs.writeFileSync('./out.json', JSON.stringify( Object.keys(master['globals']), null, 1 ) );

//Object.keys(data.globals.environments.dev009) 
//console.log(config.databasePasswords('GRECV_BFINANCE','dev008'))
//console.log( Object.keys(master['deployable-units']) ); 

module.exports = config;


/* NOTES
	
	master['deployable-units']
	DU Keys
	master['deployable-units']['tdi-gpas-policycenter-jboss']['environments']['dev008']

*/