var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/authController');


/* GET users listing. */
router.post('/',user_controller.auth_post);

module.exports = router;

