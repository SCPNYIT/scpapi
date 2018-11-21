var Message = require('../models/message');
var db = require('./db');

exports.programs_get = function(req, res) {
	console.log("get cambr programs");
	db.get('CAMBR').query(
	    'SELECT act.bankId, act.programId, bpm.name, SUM(stats.balance) AS balance, SUM(trans.amount) AS netTrans FROM account_types act ' +
        'INNER JOIN bank_program_map bpm ON act.bankId = bpm.bankId AND act.programId = bpm.programId ' +
        'LEFT OUTER JOIN statistics_sc stats ON act.bankId = stats.bankId AND act.programId = stats.programId ' +
        'AND act.accountType = stats.accountType AND stats.date = CURDATE() ' +
        'LEFT OUTER JOIN transactions trans ON stats.date = trans.transdate AND stats.programId = SUBSTRING(trans.subAcctId,1,4) ' +
        'GROUP BY act.bankId, act.programId, bpm.name',
		function(err, rows){
		if(err){
			 res.send("Error: cambr.programs.get " + err);
		}
		else {
			res.json(rows);
		}
	});
};

exports.get_programs_log = function(req, res) {
	console.log("get cambr log of a program");
	const bank_program = req.param('bankId') + "-" + req.param('programId');

	var q_str = "SELECT pk, infoLevel, itemName, description FROM cambr_log WHERE runDate = CURDATE() " +
		"and itemName = '" + bank_program + "' and InfoLevel in ('WARNING','ERROR','NEWS')";
	db.get('CAMBR').query(q_str, function(err, rows) {
		if (err) {
			res.send("Error: get cambr log "+err);
		}
		else {
			res.json(rows);
		}
	});
};

exports.get_program_stats = function(req, res) {
    console.log("get statistics balance and net Trans of a program");
    const bankId = req.param('bankId');
    const programId = req.param('programId');

    var q_str = 'SELECT act.bankId, act.programId, bpm.name, SUM(stats.balance) AS balance, SUM(trans.amount) AS netTrans FROM account_types act ' +
        'INNER JOIN bank_program_map bpm ON act.bankId = bpm.bankId AND act.programId = bpm.programId ' +
        'LEFT OUTER JOIN statistics_sc stats ON act.bankId = stats.bankId AND act.programId = stats.programId ' +
        'AND act.accountType = stats.accountType AND stats.date = CURDATE() ' +
        'LEFT OUTER JOIN transactions trans ON stats.date = trans.transdate AND stats.programId = SUBSTRING(trans.subAcctId,1,4) ' +
        "WHERE stats.programId = '" + programId + "'" +
        'GROUP BY act.bankId, act.programId, bpm.name';
    db.get('CAMBR').query(q_str, function(err, rows) {
        if (err) {
            res.send("Error: get statistics balance and net Trans "+err);
        }
        else {
            res.json(rows);
        }
    });
};

exports.get_program_trans = function(req, res) {
    console.log("get net transactions of a program");
    const bankId = req.param('bankId');
    const programId = req.param('programId');

    var q_str = "SELECT amount from transactions trans " +
        "WHERE trans.transdate = CURDATE() " +
        "and trans.subAcctId = '" + programId + "C'";
    db.get('FICA').query(q_str, function(err, rows) {
        if (err) {
            res.send("Error: get net transactions "+err);
        }
        else {
            res.json(rows);
        }
    });
};

exports.get_cs_notes = function(req, res) {
    console.log("get client service notes of an item");
    const bank_program = req.param('bankId') + "-" + req.param('programId');
    const pk = req.param('pk');

    var q_str = "SELECT id, note, notedBy, state, signOffBy FROM cambr_cs_notes WHERE item_pk = " + pk;
    db.get('CAMBR').query(q_str, function(err, rows) {
        if (err) {
            res.send("Error: get cambr cs notes "+err);
        }
        else {
            res.json(rows);
        }
    });
};

exports.post_cs_notes = function(req, res) {
    console.log("insert a client service note");
    const bank_program = req.param('bankId') + "-" + req.param('programId');
    pk = req.param('pk');
    note = req.body.note;
    notedBy = req.body.notedBy;
    state = req.body.state;
    signOffBy = req.body.signOffBy;

    var q_str = "INSERT INTO cambr_cs_notes (item_pk, bank_program, note, notedBy, state, signOffBy) VALUES ("
        + pk + ",'" + bank_program + "','" + note + "','" + notedBy + "'," + state + ",'" + signOffBy + "')" ;

    db.get('CAMBR').query(q_str, function(err, data) {
        if (err) {
            res.send("Error: insert a client service note "+err);
        }
        else {
            res.json(data);
        }
    });
};

exports.update_cs_notes_state = function(req, res) {
    console.log("update client service note state");
    const bank_program = req.param('bankId') + "-" + req.param('programId');
    id = req.param('id');
    state = req.body.state;
    signOffBy = req.body.signOffBy;

    var q_str = "UPDATE cambr_cs_notes SET state = " + state + ", signOffBy = '" + signOffBy + "'" +
        "WHERE id = " + id;
    db.get('CAMBR').query(q_str, function(err, data) {
        if (err) {
            res.send("Error: update cambr log "+err);
        }
        else {
            res.json(data);
        }
    });
};
