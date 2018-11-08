var mysql = require('mysql');
var async = require('async');

var FICA_DEV_HOST = 'bespinvader';
var FICA_PROD_HOST = 'vader';

var CAMBR_DEV_HOST = 'cambr1.cfljt78pokai.us-east-1.rds.amazonaws.com';
var CAMBR_PROD_HOST = 'cambr2.cfljt78pokai.us-east-1.rds.amazonaws.com';

exports.MODE_DEV = 'dev';
exports.MODE_PROD = 'prod';

exports.serveMode;

var state = {
	fica_pool: null,
	cambr_pool: null,
	local_pool: null,
	mode: null,
}

exports.connect = function(mode, done) {

	state.fica_pool = mysql.createPool({
        connectionLimit: 4,
        host: mode === exports.MODE_PROD? FICA_PROD_HOST : FICA_DEV_HOST,
        user: 'root',
        password: 'mysql',
        database: 'usbfica',
    });

    state.cambr_pool = mysql.createPool({
        connectionLimit: 4,
        host: mode === exports.MODE_PROD? CAMBR_PROD_HOST : CAMBR_DEV_HOST,
        user: 'cambr',
        password: 'St#net!ger55',
        database: mode === exports.MODE_PROD? 'cambr' : 'cambrdev'
    });

	state.local_pool = mysql.createPool({
		connectionLimit: 10,
		connectTimeout  : 60 * 60 * 1000,
                aquireTimeout   : 60 * 60 * 1000,
                timeout         : 60 * 60 * 1000,
		host     : process.env.RDS_HOSTNAME,
  		user     : process.env.RDS_USERNAME,
  		password : process.env.RDS_PASSWORD,
  		port     : process.env.RDS_PORT,
		database : mode === exports.MODE_PROD? 'cambr' : 'cambrdev'
	});


	state.mode = mode;
	done();
}

exports.get = function(product) {
    if(product == 'FICA') {
        return state.fica_pool;
    }

	if(product == 'CAMBR') {
		return state.cambr_pool;
	}

    if(product == 'LOCAL') {
        return state.local_pool;
    }
}
