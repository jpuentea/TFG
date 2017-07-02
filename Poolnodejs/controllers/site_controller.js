var models = require('../models');
var Sequelize = require('sequelize');

var Web3 = require("./web3");

var direccion = "0x6bec34ad15f1435b2d61b1738fa672561c1636e5";
//Función para pasar de bytes32 a string
 function hex2a(hexx) {
     var hex = hexx.toString();//forzar conversión
     var str = '';
     for (var i = 0; i < hex.length; i += 2)
         str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
     return str;
 }


// GET /sites/new
exports.token = function(req, res, next) {
    //var contra = new Object();
    var web3 = Web3.web3;
    var primaryAddress = Web3.primaryAddress;
    var abi = Web3.abi;
    var MyContract = Web3.MyContract;

   
    var rol = req.body.rol;
    

    var contractInstance = MyContract.at(direccion);

     contractInstance.registraToken.sendTransaction(rol,
        { from: primaryAddress, 
          gas: 3000000
        });
     //contra.token = contractInstance.devuelveToken.call();
     //contractInstance.limpiaToken.call();
     //res.render('sites/token', { url: req.protocol + "://" + req.headers.host,
        //                        contra: contra });
        res.render('sites/token');
    
};
exports.verToken = function(req, res, next) {
    var contra = new Object();
    contra.token = "0x0";
    var web3 = Web3.web3;
    var primaryAddress = Web3.primaryAddress;
    var abi = Web3.abi;
    var MyContract = Web3.MyContract;


    var contractInstance = MyContract.at(direccion);

    contra.token = contractInstance.devuelveToken.call({from:primaryAddress});
    

    res.render('sites/vertoken', { url: req.protocol + "://" + req.headers.host,
                                contra: contra });


  };




exports.encuestas = function(req, res, next) {
		var encuestas = new Object();
        var web3 = Web3.web3;
        var primaryAddress = Web3.primaryAddress;
        var abi = Web3.abi;
        var MyContract = Web3.MyContract;


        var contractInstance = MyContract.at(direccion);
        var n = contractInstance.devuelveTodasEncuestas.call();
        var aux = [];
        
        var a = "";
        for(var i = 0; i<n.length ; i++){
            aux[i] = hex2a(n[i]).toString().replace(/\0/gi, '');
          
        }
        
        encuestas = aux;
        //encuestas.long = encuestas[0].length;
       
        res.render('sites/encuestas', { url: req.protocol + "://" + req.headers.host,
                                encuestas: encuestas });
 
    
};


exports.new = function(req, res, next) {
    //var aplicacion = models.Aplicaciones.build({  name: "",roles:"", address: "" });

    res.render('sites/new');
};
exports.createEncuesta = function(req, res, next) {

    var web3 = Web3.web3;
    var primaryAddress = Web3.primaryAddress;
    var abi = Web3.abi;
    var MyContract = Web3.MyContract;

    var nombre = req.body.nombre;
    var participantes = req.body.participantes.split(',');

    var puntuaciones = req.body.puntuaciones.split(',');
   


    var contractInstance = MyContract.at(direccion);

        contractInstance.createVotacion.sendTransaction(
        nombre,participantes,puntuaciones,
        { from: primaryAddress, 
          gas:1000000
        });

       
    req.flash("info", "Se ha programado el registro de su aplicacion " +  req.body.nombre + ". Espere hasta que se registre en la red.")
    res.redirect('/encuestas');
};

exports.muestra = function(req, res, next) {
    var encuesta = new Object();
    encuesta.nombre = req.params.nombre;
    var web3 = Web3.web3;
        var primaryAddress = Web3.primaryAddress;
        var abi = Web3.abi;
        var MyContract = Web3.MyContract;


        var contractInstance = MyContract.at(direccion);
        encuesta.puntuaciones = contractInstance.devuelvePuntuaciones.call(encuesta.nombre);
        //si esto no funciona, llamo por las direcciones de los usuarios.

       var n = contractInstance.devuelveEncuestados.call(encuesta.nombre);
       for (var i = 0; i< n.length ; i++) {
           n[i] = hex2a(n[i]).toString().replace(/\0/gi, '');
       }
       encuesta.encuestados = n;


        
       
    res.render('sites/muestra', { encuesta: encuesta });
};



exports.vota = function(req, res, next) {
  var aspirante = new Object();
  aspirante.nombre = req.params.nombre;
  aspirante.encuesta = req.params.encuesta;
  var web3 = Web3.web3;
        var primaryAddress = Web3.primaryAddress;
        var abi = Web3.abi;
        var MyContract = Web3.MyContract;


        var contractInstance = MyContract.at(direccion);
        contractInstance.vota.sendTransaction(aspirante.encuesta,aspirante.nombre, { from: primaryAddress, 
          gas:1000000
        });
        res.render('sites/votado', { aspirante: aspirante });

  };


	
