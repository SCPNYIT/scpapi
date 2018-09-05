var express = require('express');
var router = express.Router();
var cambr_controller = require('../controllers/cambrController');

router.get('/', function(req, res, next) {
  res.send('cambr api');
});

router.get('/programs',cambr_controller.programs_get); 

module.exports = router;

