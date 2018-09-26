var mysql = require('mysql');
var async = require('async');

exports.MODE_DEV = 'dev';
exports.MODE_PROD = 'prod';

exports.serveMode;

var state = {
	cambr_pool: null,
	mode: null,
}

exports.connect = function(mode, done) {

	state.cambr_pool = mysql.createPool({
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
	if(product == 'CAMBR') {
		return state.cambr_pool;
	}
}
