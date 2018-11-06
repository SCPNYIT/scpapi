var express = require('express');
var router = express.Router();
var cambr_controller = require('../controllers/cambrController');

router.get('/', function(req, res, next) {
  res.send('cambr api');
});

router.get('/programs',cambr_controller.programs_get);
router.get('/programs/log/:bankId/:programId',cambr_controller.get_programs_log);
router.post('/programs/log/:bankId/:programId/:pk',cambr_controller.post_cs_notes);
router.get('/programs/log/:bankId/:programId/:pk',cambr_controller.get_cs_notes);
router.post('/programs/log/:bankId/:programId/:pk/:id',cambr_controller.update_cs_notes_state);
router.get('/programs/stats/:bankId/:programId', cambr_controller.get_program_stats);
module.exports = router;

