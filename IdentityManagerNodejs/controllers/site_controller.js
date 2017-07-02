
var models = require('../models');
var Sequelize = require('sequelize');

var Web3 = require("./web3");

//Función para pasar de bytes32 a string
 function hex2a(hexx) {
     var hex = hexx.toString();//forzar conversión
     var str = '';
     for (var i = 0; i < hex.length; i += 2)
         str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
     return str;
 }

 var direccion = "0x950a13dc7a79187e519e6d7d5d5e1065fe9d35a2";



// GET /sites
exports.index = function(req, res, next) {


    

        var info = new Object();
        var web3 = Web3.web3;
        var primaryAddress = Web3.primaryAddress;
        var abi = Web3.abi;
        var MyContract = Web3.MyContract;

        //var direccion = "0xbca92a10fce07dc5eae8eb6904233ee77f3ffe68";

        var contractInstance = MyContract.at(direccion);
        var n = contractInstance.devuelveTodasApps.call();
        var aux = [];
        var aux1 = [];
        var aux2 = [];
        var aux3 = [];
        var a = "";
        for(var i = 0; i<n.length ; i++){
            aux[i] = hex2a(n[i]);
            aux1[i] = contractInstance.devuelveAppaddr.call(n[i]);
            var aux3 = contractInstance.devuelveApproles.call(n[i]);
            if(aux3.length > 1){
                for(var t = 0; t < aux3.length ; t++){
                a += hex2a(aux3[t]) + ",";
                aux2[i] = a.replace(/,$/, "");

            }a = "";

            }else{
                aux2[i]= hex2a(contractInstance.devuelveApproles.call(n[i]));
            }
         
        }
        info.direction = direccion;
        info.addr = aux1;
        info.roles = aux2;
        info.nombres = aux;
        info.url = 'sites/index';
        res.render('sites/index', { url: req.protocol + "://" + req.headers.host,
                                info: info });
    };


// GET /sites
exports.users = function(req, res, next) {
    var info = new Object();
    var web3 = Web3.web3;
        var primaryAddress = Web3.primaryAddress;
        var abi = Web3.abi;
        var MyContract = Web3.MyContract;

        //var direccion = "0xbca92a10fce07dc5eae8eb6904233ee77f3ffe68";

        var contractInstance = MyContract.at(direccion);
        var n = contractInstance.devuelveUsers.call();
        info.long = n.length;
        var aux = [];
        var aux2 = [];
        
       for (var i = 0; i< n.length ; i++) {
           aux[i] = hex2a(n[i]).toString().replace(/\0/gi, '');
         
           aux2[i] = contractInstance.devuelveAddressUsuario.call(n[i]);
       }
        info.direction = direccion;
        info.nombres = aux;
        info.addr = aux2;
        info.url = 'sites/users';
        
    res.render('sites/users', { url: req.protocol + "://" + req.headers.host,
                                info: info });
    }

// GET /sites/new
exports.new = function(req, res, next) {
    //var aplicacion = models.Aplicaciones.build({  name: "",roles:"", address: "" });

    res.render('sites/new');
};

// GET /sites/newUser
exports.newUser = function(req, res, next) {
    //var usuario = models.Usuarios.build({  rol:"",name: "",aplicacion: "" });

    res.render('sites/newUser');
};

exports.muestra = function(req, res, next) {
    var info = new Object();
    info.nombre = req.params.usuario;
    var web3 = Web3.web3;
        var primaryAddress = Web3.primaryAddress;
        var abi = Web3.abi;
        var MyContract = Web3.MyContract;

        
        var contractInstance = MyContract.at(direccion);
        
       var n = contractInstance.devuelveRoles.call(info.nombre,{from:primaryAddress,gas:500000});
       for (var i = 0; i< n.length ; i++) {
           n[i] = hex2a(n[i]);
       }
       info.roles = n;


        var l = contractInstance.devuelveApps.call(info.nombre,{from:primaryAddress,gas:500000});
     
       for (var b = 0; b< l.length ; b++) {
           l[b] = hex2a(contractInstance.devuelveNombreApp.call(l[b]));
           l[b] = l[b].toString().replace(/\0/gi, '');
       }
      
       info.direction = direccion;
       info.apps = l;
       info.url = 'sites/muestra';
    res.render('sites/muestra', { info: info });
};

// POST /sites
exports.createApp = function(req, res, next) {
    var a = ""
    var web3 = Web3.web3;
    var primaryAddress = Web3.primaryAddress;
    var abi = Web3.abi;
    var MyContract = Web3.MyContract;

    var nombre = req.body.nombre;
    var addr = req.body.address;

    var roles = req.body.roles.split(',');
   

   

    var contractInstance = MyContract.at(direccion);

        contractInstance.registrarApp.sendTransaction(
        nombre,addr,roles,
        { from: primaryAddress, 
          gas: 500000
        });

    contractInstance.Resultstring(function(err,data){
        req.flash("info", "El nombre introducido ya existe, introduzca otro")
        console.log("El nombre introducido ya existe, introduzca otro");
    });

       

    req.flash("info", "Se ha programado el registro de su aplicacion " +  req.body.nombre + ". Espere hasta que se registre en la red.")
    res.redirect('/apps');
};


// POST /sites
exports.createUsers = function(req, res, next) {
     var web3 = Web3.web3;
    var primaryAddress = Web3.primaryAddress;
    var abi = Web3.abi;
    var MyContract = Web3.MyContract;

    var nombre = req.body.nombre;
    var aplicacion = req.body.aplicacion;
    var rol = req.body.rol;
    var token = req.body.token;
   

    //var direccion = "0xbca92a10fce07dc5eae8eb6904233ee77f3ffe68";

    var contractInstance = MyContract.at(direccion);

        contractInstance.registrarUsuario.sendTransaction(
        rol,nombre,aplicacion,token,
        { from: primaryAddress, 
          gas: 500000
        });

    req.flash("info", "Se ha programado el registro de su usuario" +  req.body.nombre + ". Espere hasta que se registre en la red.")
    res.redirect('/users');
};


exports.elimina = function(req, res, next) {
     var web3 = Web3.web3;
    var primaryAddress = Web3.primaryAddress;
    var abi = Web3.abi;
    var MyContract = Web3.MyContract;

    var nombre = req.params.usuario;
    var aplicacion = req.params.aplicacion;
   
   

    //var direccion = "0xbca92a10fce07dc5eae8eb6904233ee77f3ffe68";

    var contractInstance = MyContract.at(direccion);

        contractInstance.borrarRegistro.sendTransaction(
        nombre,aplicacion,
        { from: primaryAddress, 
          gas: 3000000
        });

    req.flash("info", "Se ha programado el borrado. Espere hasta que se registre en la red.")
    res.redirect('/users');
};

    
  










