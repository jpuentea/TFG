var express = require('express');
var router = express.Router();

var siteCtrl = require("../controllers/site_controller");

/* GET home page. */

router.get('/', function(req,res,next){
	res.render('index');
});

router.get('/apps', siteCtrl.index);
router.get( '/users',	siteCtrl.users);
router.get( '/apps/new', siteCtrl.new);
router.post( '/apps',	siteCtrl.createApp);
router.get(   '/users/new',siteCtrl.newUser);
router.post( '/users',	siteCtrl.createUsers);
router.get('/muestra/:usuario', siteCtrl.muestra);
router.get('/elimina/:usuario/:aplicacion', siteCtrl.elimina);


module.exports = router;