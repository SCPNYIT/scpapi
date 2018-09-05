var Message = require('../models/message');
var db = require('./db');

exports.programs_get = function(req, res) {
	db.get('CAMBR').query('SELECT * FROM account_types', function(err, rows){
		if(err){
			 res.send("Error: cambr.programs.get " + err);
		}
		else {
			res.json(rows);
		}
	});
};
