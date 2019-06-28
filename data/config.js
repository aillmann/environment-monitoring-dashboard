var config = {
	envs: [	'dev002', 
			'dev005', 
			'dev006', 
			'dev018', 
			'dev008', 
			'dev019', 
			'dev009', 
			'dev010', 
			'dev011',
			'dev012', 
			'dev013', 
			'dev016', 
			'dev017', 
			'sit006', 
			'sit007', 
			'sit011', 
			'sit012', 
			'sit009',
			'sit013',
			'dcq1022', 
			'dev1022',
			'deperf2',
			// Higher Envs
			/*'deperf1',*/ 
			'bat002', 
			'bat003',
			'be1'
		],
	envs2: {
        'dev005': {
            'excludedProducts': ['contactmgr-parties']
        },
        /**/     
        'dev006': {
            'excludedProducts': ['contactmgr-parties', 'geodata']
        },
        'dev013': {
            'includedProducts': ['policy-center', 'billing-center', 'contact-manager']
        },
		'sit007': {
			'includedProducts': ['policy-center', 'billing-center', 'contact-manager']
		},
		'sit012': {
			'includedProducts': ['policy-center', 'billing-center', 'contact-manager']
		},
		'dev018': {
			'includedProducts': ['policy-center', 'billing-center', 'contact-manager']
		},
		'dev019': {
			'includedProducts': ['policy-center', 'billing-center', 'contact-manager']
		},
        'dev010': {
           'excludedProducts': ['contactmgr-parties', 'geodata']
        },
        'dev017': {
           'excludedProducts': ['contactmgr-parties', 'geodata']
        },
		'dev010': {
			'excludedProducts': ['geodata']
		},
		'dev012': {
			'excludedProducts': ['geodata']
		},
		'dev009': {
			'excludedProducts': ['contactmgr-parties', 'geodata']
		},
        'dcq1022': {
            'excludedProducts': ['contactmgr-parties', 'geodata']
        }, 
		'bat003': {
			'includedProducts': ['policy-center', 'billing-center', 'contact-manager']
		}
	},
	sysEnvs: ['deperf2', 'bat002', 'bat003', 'be1'], 
	products: {
		'policy-center': {
			'name': 'Policy Center',
			'du': 'policycenter',
			'pathTemplate': '/pc'
		},
		'billing-center': {
			'name': 'Billing Center',
			'du': 'billingcenter',
			'pathTemplate': '/bc'
		},
		'contact-manager': {
			'name': 'Contact Manager',
			'du': 'gwcm',
			'pathTemplate': '/ab'
		},

		'contactmgr-parties': {
			'name': 'Contact Manager Parties',
			'du': 'contactmgr-parties', 
			'pathTemplate': '/contactmgr-parties'
		},

		'calculate-auto-premium': {
			'name': 'Caculate Auto Premium',
			'du': 'rating', 
			'pathTemplate': '/calculate-auto-premium'
		},
		'proxy-model': {
			'name': 'Proxy Model',
			'du': 'rating', 
			'pathTemplate': '/proxy-model'
		},
		'api-occasional-driver-assignment': {
			'name': 'Occasional Driver Assignment',
			'du': 'rating', 
			'pathTemplate': '/api-occasional-driver-assignment'
		},

		'mvr-renewal': {
			'name': 'MVR Renewal',
			'du': 'uae-decision', 
			'pathTemplate': '/mvr-renewal'
		},
		'client-qualification': {
			'name': 'Client Qualification',
			'du': 'uae-decision', 
			'pathTemplate': '/client-qualification'
		},
		'large-loss': {
			'name': 'Large Loss',
			'du': 'uae-decision', 
			'pathTemplate': '/large-loss'
		},
		'oil-tank': {
			'name': 'Oil & Auxiliary',
			'du': 'uae-decision', 
			'pathTemplate': '/oil-tank'
		},

		'customer-segmentation': {
			'name': 'Customer Segmentation',
			'du': 'uae-segmentation', 
			'pathTemplate': '/customer-segmentation'
		},
		'condo-content': {
			'name': 'Condo Content',
			'du': 'uae-segmentation', 
			'pathTemplate': '/condo-content'
		},
		'coverage-offering-res': {
			'name': 'Offering and Advice',
			'du': 'uae-segmentation',
			'pathTemplate': '/coverage-offering-res'
		},
		'coverage-offering': {
			'name': 'Coverage Offering',
			'du': 'uae-segmentation',
			'pathTemplate': '/coverage-offering'
		},
		'eligibility': {
			'name': 'Eligibility',
			'du': 'uae-segmentation',
			'pathTemplate': '/eligibility'
		},
		'lifetime-profitability': {
			'name': 'Lifetime Profitability',
			'du': 'uae-segmentation',
			'pathTemplate': '/lifetime-profitability'
		},
		'written-application': {
			'name': 'Written Application',
			'du': 'uae-segmentation',
			'pathTemplate': '/written-application'
		},
		'decline': {
			'name': 'Decline',
			'du': 'uae-segmentation',
			'pathTemplate': '/decline'
		},

		'billing-financials-events': {
			'name': 'Billing Financials Events',
			'du': 'billingfinancials',
			'pathTemplate': '/billing-financials-events'
		},
		'disbursement-number': {
			'name': 'Disbursment Number',
			'du': 'billingfinancials',
			'pathTemplate': '/disbursement-number'
		},
		'bank-account': {
			'name': 'Bank Account',
			'du': 'billingfinancials',
			'pathTemplate': '/bank-account'
		},
		'calendars': {
			'name': 'Calendars',
			'du': 'billingfinancials',
			'pathTemplate': '/calendars'
		},
		'cheque-reconciliation': {
			'name': 'Cheque Reconciliation',
			'du': 'billingfinancials',
			'pathTemplate': '/cheque-reconciliation'
		},
		'credit-cards': {
			'name': 'Credit Cards',
			'du': 'billingfinancials',
			'pathTemplate': '/credit-cards'
		},
		'legacy-billing': {
			'name': 'Legacy Billing',
			'du': 'billingfinancials',
			'pathTemplate': '/legacy-billing'
		},
		'payments-disbursements-events': {
			'name': 'Payments Disbursements Events',
			'du': 'billingfinancials',
			'pathTemplate': '/payments-disbursements-events'
		},

		'autoplus-report': {
			'name': 'Autoplus Report',
			'du': 'externalreport',
			'pathTemplate': '/autoplus-report'
		},
		'geo-spatial-point': {
			'name': 'Geo Spatial Point',
			'du': 'externalreport',
			'pathTemplate': '/geo-spatial-point'
		},
		'creditscore-report': {
			'name': 'Credit Score report',
			'du': 'externalreport',
			'pathTemplate': '/creditscore-report'
		},
		'bvs': {
			'name': 'BVS',
			'du': 'externalreport',
			'pathTemplate': '/bvs'
		},
		'mvr-report': {
			'name': 'MVR Report',
			'du': 'externalreport',
			'pathTemplate': '/mvr-report'
		},
		'real-estates': {
			'name': 'Real Estates',
			'du': 'externalreport',
			'pathTemplate': '/real-estates'
		},
		'credit-bureau': {
			'name': 'Credit Bureau',
			'du': 'externalreport',
			'pathTemplate': '/credit-bureau'
		},
		'locators-protection-detail': {
			'name': 'Locators Protection Detail',
			'du': 'externalreport',
			'pathTemplate': '/locators-protection-detail'
		},
		'geographical-area-risk': {
			'name': 'Geographical Area Risk',
			'du': 'externalreport',
			'pathTemplate': '/geographical-area-risk'
		},

		'accounts': {
			'name': 'Accounts',
			'du': 'parties',
			'pathTemplate': '/accounts'
		},
		'parties': {
			'name': 'Parties',
			'du': 'parties',
			'pathTemplate': '/parties'
		},
		'policies': {
			'name': 'Policies',
			'du': 'parties',
			'pathTemplate': '/policies'
		},

		'correspondences': {
			'name': 'Correspondences',
			'du': 'contentenrichment',
			'pathTemplate': '/correspondences'
		},
		'documents-aggregations': {
			'name': 'Documents Aggregations',
			'du': 'contentenrichment',
			'pathTemplate': '/documents-aggregations'
		},

		'minor-accident': {
			'name': 'Minor Accident',
			'du': 'custom',
			'pathTemplate': '/minor-accident'
		},
		'insured-assets-legacy': {
			'name': 'Insured Assets Legacy',
			'du': 'custom',
			'pathTemplate': '/insured-assets-legacy'
		},
		'ratable-groups': {
			'name': 'Ratable Groups',
			'du': 'custom',
			'pathTemplate': '/ratable-groups'
		},
		'ubi': {
			'name': 'UBI',
			'du': 'custom',
			'pathTemplate': '/ubi'
		},
		'insured-assets': {
			'name': 'Insured Assets',
			'du': 'custom',
			'pathTemplate': '/insured-assets'
		},
		
		'validators': {
			'name': 'License Validator',
			'du': 'validators',
			'pathTemplate': '/v1'
		},

		'affinity-group': {
			'name': 'Affinity Group',
			'du': 'group',
			'pathTemplate': '/v1'
		},

		'portfolio': {
			'name': 'Portfolio',
			'du': 'portfolio',
			'pathTemplate': '/v1'
		},

		'vicc': {
			'name': 'VICC',
			'du': 'vicc',
			'pathTemplate': '/v1'
		},

		'geodata': {
			'name': 'Geodata',
			'du': 'geodata',
			'pathTemplate': '/v1'
		}

/*	Reading master.json has been deprecated		
,

		'GPAS_PCUSER': {
			'name': 'Policy Center Database Schema',
			'du': 'guidewire-db',
			'pathTemplate': 'GPAS01.TDBANK.CA'
		},
		'GBILL_BCUSER': {
			'name': 'Billing Center Database Schema',
			'du': 'guidewire-db',
			'pathTemplate': 'GPAS01.TDBANK.CA'
		},
		'G0071_ABUSER': {
			'name': 'Contact Manager Database Schema',
			'du': 'guidewire-db',
			'pathTemplate': 'GPAS01.TDBANK.CA'
		},
		'G0071_AUDUSER': {
			'name': 'Guidewire Audit Database Schema',
			'du': 'guidewire-db',
			'pathTemplate': 'GPAS01.TDBANK.CA'
		},

		'GDIG_DIGITIZATION': {
			'name': 'Digitization Database Schema',
			'du': 'policyextension-db',
			'pathTemplate': 'GPBTC01.TDBANK.CA'
		},
		'GPAS_VICCUSER': {
			'name': 'VICC Database Schema',
			'du': 'policyextension-db',
			'pathTemplate': 'GPBTC01.TDBANK.CA'
		},
		'GA251_UAEMODEL': {
			'name': 'UAE Database Schema',
			'du': 'policyextension-db',
			'pathTemplate': 'GPBTC01.TDBANK.CA'
		},
		'GA521_EXTERNALREPORT': {
			'name': 'External Report Database Schema',
			'du': 'policyextension-db',
			'pathTemplate': 'GPBTC01.TDBANK.CA'
		},
		'G0079_INSAUDIT': {
			'name': 'Insbridge Audit Database Schema',
			'du': 'policyextension-db',
			'pathTemplate': 'GPBTC01.TDBANK.CA'
		},

		'GRECV_BFINANCE': {
			'name': 'Biling Financials Database Schema',
			'du': 'financial-db',
			'pathTemplate': 'GRECV01.TDBANK.CA'
		},
		'GA441_CHEQUERECON': {
			'name': 'Cheque Reconciliation Database Schema',
			'du': 'financial-db',
			'pathTemplate': 'GRECV01.TDBANK.CA'
		},
		'GRECV_PDMUSER': {
			'name': 'Payments Disbursements Events Database Schema',
			'du': 'financial-db',
			'pathTemplate': 'GRECV01.TDBANK.CA'
		}*/
		

	},
	dus: {
		'policycenter': {
			'urlTemplate': '.policycenter.gpas.app.dev.td.com',
			'type': 'gw'
		},
		'billingcenter': {
			'name': 'Guidewire Billing Center',
			'urlTemplate': '.billingcenter.gbill.app.dev.td.com',
			'type': 'gw'
		},
		'gwcm': {
			'urlTemplate': '.gwcm.g0071.app.dev.td.com',
			'type': 'gw'
		},
		'contactmgr-parties': {
			'urlTemplate': '.contactmgr-parties.g0071.api.dev.td.com',
			'type': 'api-java'
		},
		'rating': {
			'urlTemplate': '.rating.g0079.api.dev.td.com',
			'type': 'api-java'
		},
		'uae-segmentation': {
			'urlTemplate': '.segmentation.ga251.api.dev.td.com',
			'type': 'api-java'
		},
		'uae-decision': {
			'urlTemplate': '.decision.ga251.api.dev.td.com',
			'type': 'api-java'
		},
		'billingfinancials': {
			'urlTemplate': '.billingfinancials.ga441.api.dev.td.com',
			'type': 'api-java'
		},
		'externalreport': {
			'urlTemplate': '.externalreport.ga521.api.dev.td.com',
			'type': 'api-java'
		},
		'parties': {
			'urlTemplate': '.client.gcif.api.dev.td.com',
			'type': 'api-java'
		},
		'contentenrichment': {
			'urlTemplate': '.contentenrichment.gdig.api.dev.td.com',
			'type': 'api-java'
		},
		'custom': {
			'urlTemplate': '.custom.gpas.api.dev.td.com',
			'type': 'api-java'
		},
		'validators': {
			'urlTemplate': '.validators.gcif.api.dev.td.com',
			'type': 'api-node'
		}, 
		'group': {
			'urlTemplate': '.group.ggrou.api.dev.td.com',
			'type': 'api-node'
		},
		'portfolio': {
			'urlTemplate': '.portfolio.gcif.api.dev.td.com',
			'type': 'api-node'
		},
		'vicc': {
			'urlTemplate': '.vicc.gpas.api.dev.td.com',
			'type': 'api-node'
		},
		'geodata': {
			'urlTemplate': '.geodata.ggeo.api.dev.td.com',
			'type': 'api-node'
		}

/*	Reading master.json has been deprecated		
,
		'guidewire-db': {
			'urlTemplate': '.guidewire.gwdbs.db.dev.td.com',
			'type': 'db'
		},
		'policyextension-db': {
			'urlTemplate': '.policyextension.gpbtc.db.dev.td.com',
			'type': 'db'
		},
		'financial-db': {
			'urlTemplate': '.financial.grecv.db.dev.td.com',
			'type': 'db'
		}*/

	},
	statusLabel: {
		2: "green",
		1: "yellow",
		0: "red",
		10: "timeout"
	},

	baseUrl: function(env, product) {
		var du = this.products[product].du;
		var out;

		switch( this.productType(product) ) {
			case 'api-java':
				out = 'http://' + env + this.dus[du].urlTemplate + ':8080' + this.products[product].pathTemplate ;
				break;
			case 'gw':
				out = 'http://' + env + this.dus[du].urlTemplate + ':8080' + this.products[product].pathTemplate;
				break;
			case 'api-node':
				out = 'http://' + env + this.dus[du].urlTemplate + ':3080' + this.products[product].pathTemplate;
				break;
			case 'db':
				out = env + this.dus[du].urlTemplate + ':1515/' + env.toUpperCase() + this.products[product].pathTemplate;
				break;
			default:
				out = null;
		}

		if ( this.sysEnvs.includes(env) ) {
			out = out.replace('.dev.', '.sys.');
		}

		return out;
	},

	hostname: function(env, du) {
		try {
			hostname = env + this.dus[du].urlTemplate;
			if ( this.sysEnvs.includes(env) ) {
				hostname = hostname.replace('.dev.', '.sys.');
			}
			return hostname;
		} catch(err) {
			return null;
		}
	},

	productType: function(product) {
		try {
			var du = this.products[product].du;
			return this.dus[du].type;
		} catch(err) {
			return null;
		}
	},

	dusByType: function(type) {
		var dus = this.dus;
		var output = [];

		Object.keys(dus).forEach( function(du) {
			if (dus[du].type == type) {
				output.push(du);
			}
		});

		return output;
	},

	productsByDu: function(du) {
		var products = this.products;
		var output = [];

		Object.keys(products).forEach( function(product) {
			if (products[product].du == du) {
				output.push(product);
			}
		});

		return output;
	}, 

	products2: function(env) {
		if (env != undefined && this.envs2[env] != undefined) {
			var products = this.products;
			var out = [];
			if ( this.envs2[env].includedProducts != undefined) {
				return this.envs2[env].includedProducts.sort();
			} else if ( this.envs2[env].excludedProducts != undefined ) {
				Object.keys(this.products).forEach( function(product) {
					if ( !config.envs2[env].excludedProducts.includes(product) ) out.push(product)
				});
			} else {
				out = Object.keys(products);
			}
			return out.sort();
		} else {
			return Object.keys(this.products).sort();
		}
	}

};

// Unit Tests
// Test Node API
function testNodeApiConfig() {
	var product = 'validators';
	var du = 'validators';
	var env = 'dev008';
	var expected, test;
	
	console.log('--- Testing api-node baseUrl ---');
	expected = 'http://dev008.validators.gcif.api.dev.td.com:3080/v1';
	test = config.baseUrl(env, product)
	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	( expected == test ) ? console.log('PASSED') : console.log('FAILED');

	console.log('--- Testing api-node hostname ---');
	expected = 'dev008.validators.gcif.api.dev.td.com';
	test = config.hostname(env, du)
	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	( expected == test ) ? console.log('PASSED') : console.log('FAILED');
}

function testDBConfig() {
	var product = 'GPAS_PCUSER';
	var du = 'guidewire-db';
	var env = 'dev008';
	var expected, test;
	
	console.log('--- Testing api-node baseUrl ---');
	expected = 'dev008.guidewire.gwdbs.db.dev.td.com:1515/DEV008GPAS01.TDBANK.CA';
	test = config.baseUrl(env, product);
	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	( expected == test ) ? console.log('PASSED') : console.log('FAILED');

	console.log('--- Testing api-node hostname ---');
	expected = 'dev008.guidewire.gwdbs.db.dev.td.com';
	test = config.hostname(env, du);
	console.log('Expected Result: ' + expected);
	console.log('Test Result: ' + test);
	( expected == test ) ? console.log('PASSED') : console.log('FAILED');
}

// testNodeApiConfig();
// testDBConfig();
// console.log( config.baseUrl('bat002', 'policy-center') );
// console.log( config.hostname('bat002', 'policycenter') );

module.exports = config;
