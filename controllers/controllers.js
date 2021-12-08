const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require('util');

//registro
exports.register = async (req,res)=>{
    try{
        const names = req.body.names
        const appat = req.body.appat
        const apmat = req.body.apmat
        const boleta = req.body.boleta
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass,8);
        //console.log(passHash)
        conexion.query('INSERT INTO alumnos set ?',{nombre:names,appat:appat,apmat:apmat,num_boleta:boleta,pass:passHash},(err,reslts)=>{
            if(err){
                console.log(err)
            }
            res.redirect('/login')
        })
    }catch(err){
        console.log(err)
    } 
};

exports.login = async (req, res)=>{
    try {
        const boleta = req.body.username
        const pass = req.body.pass        

        if(!boleta || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM alumnos WHERE num_boleta = ?', [boleta], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el USUARIO : "+boleta)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
/*
exports.register_gestion = async (req,res)=>{
    try{
        const names = req.body.names
        const appat = req.body.appat
        const apmat = req.body.apmat
        var area = req.body.Area
        const pass = req.body.pass
        var numero_verif = req.body.codigo_de_verificacion
        let passHash = await bcryptjs.hash(pass,8);
        console.log(numero_verif)
        
        if (area = 'becas'){
            if (numero_verif = "0001") {
                conexion.query('INSERT INTO gestion set ?',{nombre:names,appat:appat,apmat:apmat,area:area,pass:passHash},(err,reslts)=>{
                    if(err){
                        console.log(err)
                    }
                    res.redirect('/login_gestion')
                })
            }
        }
        if (area = 'tutorias' ) {
            if (numero_verif = "0002") {
                conexion.query('INSERT INTO gestion set ?',{nombre:names,appat:appat,apmat:apmat,area:area,pass:passHash},(err,reslts)=>{
                    if(err){
                        console.log(err)
                    }
                    res.redirect('/login_gestion')
                })
            }
        }
        if (area = 'incripciones' ) {
            if (numero_verif = "0003") {
                conexion.query('INSERT INTO gestion set ?',{nombre:names,appat:appat,apmat:apmat,area:area,pass:passHash},(err,reslts)=>{
                    if(err){
                        console.log(err)
                    }
                    res.redirect('/login_gestion')
                })
            }else{
                res.render('register_gestion', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "codigo de verificacion incorrecto",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'register_gestion'    
                })  
            }
        }
        else{
            res.render('register_gestion', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "codigo de verificacion incorrecto",
                alertIcon:'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register_gestion'    
            })  
        }
    }catch(err){
        console.log(err)
    } 
};

exports.login_gestion = async (req, res)=>{
    try {
        const boleta = req.body.boleta
        const pass = req.body.pass        

        if(!boleta || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM usuarios WHERE num_boleta = ?', [boleta], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el USUARIO : "+boleta)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.login_admin = async (req, res)=>{
    try {
        const boleta = req.body.boleta
        const pass = req.body.pass        

        if(!boleta || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM alumnos WHERE num_bol = ?', [boleta], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el USUARIO : "+boleta)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
*/

exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM alumnos WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
}

exports.logout = (req,res)=>{
    res.clearCookie('jwt')
    return res.redirect('/login')
}