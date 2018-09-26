var User = require('../models/user');
var Message = require('../models/message');
var db = require('./db');
exports.auth_post = function(req,res) {
	console.log(req.body);
	user = req.body.un;
	password = req.body.pw;
	db.get('CAMBR').query('SELECT * FROM users WHERE id=\''+user+'\' AND Password=MD5(\''+password+'\')', function(err, rows){
		if (err) {
			res.send("Error: no FICA DB connection" + err);
		}
		else {
			if(rows.length == 1) 
			{
				console.log('good');
				user = new User(rows[0].fullname);
                        	res.json(user);
			}
			else
			{
				console.log('bad');
				message = new Message('Error', 'User name or password not correct');
				res.json(message);
			}
		}
		//db.get().release();

	});
};
