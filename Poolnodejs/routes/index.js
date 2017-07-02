var express = require('express');
var router = express.Router();

var siteCtrl = require("../controllers/site_controller");

/* GET home page. */

router.get('/', function(req,res,next){
	res.render('index');
});

router.post(  '/token',siteCtrl.token);
router.get(   '/encuestas',siteCtrl.encuestas);
router.get( '/encuesta/new', siteCtrl.new);
router.post( '/encuestas',	siteCtrl.createEncuesta);
router.get( '/verToken', siteCtrl.verToken);
router.get('/muestra/:nombre', siteCtrl.muestra);
router.get('/vota/:encuesta/:nombre', siteCtrl.vota);



module.exports = router;