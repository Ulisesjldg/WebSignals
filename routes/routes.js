const express = require ('express');
const router = express.Router();
const multer  = require('multer');
const mysql = require('mysql2');
const { sendEmail } = require('./mail');
const moment = require("moment");
const jwt = require('jwt-simple');

const signalNames = ['ECG','SPO2','FLUJOMETRO','CUATRO','CINCO'];
let signalCounter = 0;

const upload = multer({
    storage: multer.diskStorage({
        destination: __dirname+'/../public/data',
        filename: (req, file, cb) => {
            cb( null, req.body.identificacion + signalNames[signalCounter] + '.csv');
            signalCounter == 4 ? signalCounter = 0 : signalCounter++
        }
    })
});

const connection = mysql.createPool({
    
});

console.log('host');
console.log('BD connected succesfully');

const isNoLoggedUser = ( req, res, next ) => {
    return !req.session.userInfo ? next() : res.redirect('/')
}

const isValidUser = ( req, res, next ) => {    
    return req.session.userInfo ? next() : res.redirect('/')
}

const isDoctor = ( req, res, next ) => {    
    return req.session.userInfo.Tipo_De_Usuario == 2 ? next() : res.redirect('/')
}

const isPatient = ( req, res, next ) => {    
    return req.session.userInfo.Tipo_De_Usuario == 1 ? next() : res.redirect('/')
}

const authToken = (req,res,next) => {

    const jwt = require('jwt-simple');
    const moment = require("moment");

    const token = req.params.token;
    const secret = 'testsecretkey';

    if( token == undefined ) {
    
        return res.redirect('/')
    
    };
    
    try {

        const decoded = jwt.decode(token,secret);
        
        if (decoded.exp <= moment().unix()) {
        
            req.tokenInfo = 'Error'
        
            return next();
        
        } else {
        
            req.userId = decoded.sub;
            return next();
        
        };
    
    } catch (e) {
    
        req.tokenInfo = 'Error'
        return next();
    
    };

};

router.get('/',(req,res)=>{
    if (req.session.userInfo ) {
        return req.session.userInfo.Tipo_De_Usuario == 1 ? res.redirect(`/panelPaciente/${req.session.userInfo.Identificacion}`) : res.redirect('/pacientes')

    }
    res.render('index')
});

router.get('/loginpaciente', isNoLoggedUser, (req,res)=>{
    res.render('loginpaciente')
})

router.get('/login', isNoLoggedUser, (req,res)=>{
    res.render('login',{error: 'No valido'})
});

router.post('/login',isNoLoggedUser,(req,res)=>{
    const queryString = `SELECT * FROM usuarios WHERE Email = '${req.body.email}';`

    connection.query( 
        
        queryString, (err,result) => {
            if (!err) {
                if (result.length > 0 ) {

                    const isValidPass = req.body.password == result[0].Contrasena;   
    
                    if ( isValidPass ){
                        if ( result[0].Confirmado == '1' ){
                        
                            req.session.userInfo=result[0];
                            
                            return result[0].Tipo_De_Usuario = 1 ? res.redirect(`/panelPaciente/${result[0].Identificacion}`) : res.redirect('/pacientes') 
                            
                        } else {
        
                            req.session.destroy()
                            return res.redirect('./login?i=3');
                        
                        }
                        
                    } else {
    
                        return res.redirect('./login?i=2');
                    
                    }
                }    
                return res.redirect('./login?i=2');
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.get('/panel/:id', isValidUser,isDoctor,(req,res)=>{
    return res.render('panel')
});

router.get('/panelPaciente/:id', isValidUser,isPatient,(req,res)=>{
    return res.render('panelPacientes')
});


router.get('/registrar', isNoLoggedUser, (req,res)=>{
    res.render('registro')
})

router.post('/registrar', isNoLoggedUser, (req,res)=>{
    const queryvalues = `'${req.body.name}','${req.body.email}','${req.body.password}',2,0`;
    const queryString = `INSERT INTO usuarios (Nombre,Email,Contrasena,Tipo_De_Usuario,Confirmado) VALUES (${queryvalues});`
    connection.query(

        queryString, (err,result) => {
    
          if (!err) {
    
            return
    
          } else {
    
            return res.status(500).send('Ha ocurrido un error')
    
          };
    
        }
    
    );
    const secretKey = 'testsecretkey';
    const payload = {
        sub: req.body.email,
        iat: moment().unix(),
        exp: moment().add(3600, 'seconds').unix(),
    };
    const token = jwt.encode(payload,secretKey);

    sendEmail(req.body.email,token,1)
    res.redirect('/registrar?i=1')
});
 
router.get('/confirmar/:token', isNoLoggedUser, authToken, (req,res)=>{
    const queryString = `UPDATE usuarios SET Confirmado = '1' WHERE Email = '${req.userId}';`
    connection.query(

        queryString, (err,result) => {
    
          if (!err) {
    
            return res.redirect('/login?i=1') 
    
          } else {
    
            return res.status(500).send('Ha ocurrido un error')
    
          };
    
        }
    
    );
})

router.get('/recuperacion',isNoLoggedUser, (req,res)=>{
    res.render('recuperacion')
});

router.get('/pacientes', isValidUser,isDoctor, (req,res)=>{
    res.render('pacientes')
});

router.post('/pacientes', isValidUser,isDoctor, (req,res)=>{
    let queryString =`UPDATE usuarios SET `;

    req.body.name ? queryString += `Nombre = '${req.body.name}',` : null
    req.body.age ? queryString += `Edad = '${req.body.age}',` : null
    req.body.weight ? queryString += `Peso = '${req.body.weight}',` : null
    req.body.blood ? queryString += `Tipo_De_Sangre = '${req.body.blood}',` : null

    queryString += ` Id = ${req.session.userInfo.Id} WHERE Id = '${req.session.userInfo.Id}';`;
    connection.query(

        queryString, (err,result) => {
    
          if (!err) {
            const queryString2 = `SELECT * FROM usuarios WHERE Email = '${req.session.userInfo.Email}';`

            connection.query( 
                
                queryString2, (err,result) => {
                    if (!err) {

                        req.session.userInfo = result[0]
                        return res.redirect('/datospersonales?i=1')    
                        
                    } else {

                        console.log(`Ha ocurrido el siguiente ${err}`);
                    }
                }
            )
          
        } else {
    
            return res.status(500).send('Ha ocurrido un error')
    
          };
    
        }
    
    );
});

router.get('/medicacion', isValidUser, isDoctor,(req,res)=>{
    res.render('medicacion')
});

router.get('/logout', isValidUser, (req,res)=>{
    req.session.destroy()
    return res.redirect('/')
});


// =========================== API's =============================
 
router.get('/api/getpatients', isValidUser,isDoctor, (req,res)=>{

    const queryString = 'SELECT * FROM usuarios WHERE Tipo_De_Usuario = 1 ORDER BY Estado ASC, Edad DESC;'

    connection.query( 
                
        queryString, (err,result) => {
            if (!err) {

                return res.send(result)   
                
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
    
});

router.post('/api/createpatient', 
    isValidUser,
    isDoctor,
    upload.array('signals'), 
    (req,res)=>{

    const data = req.body;
    const values = `'${data.nombre}','${data.email}','${data.contrasena}',1,1,'${data.estado}','${data.identificacion}','${data.sexo}','${data.fecha_nacimiento}','${data.telefono}','${data.ciudad}','${data.direccion}','${data.eps}','${data.edad}','${data.estatura}','${data.peso}','${data.antecedentes}','${data.comentarios}'`
    const queryString = `INSERT INTO usuarios (Nombre,Email,Contrasena,Tipo_De_Usuario,Confirmado,Estado,Identificacion,Sexo,Fecha_De_Nacimiento,Telefono,Ciudad,Direccion,Eps,Edad,Estatura,Peso,Antecedentes_Clinicos,Comentarios) VALUES (${values});`

    connection.query( 
                
        queryString, (err,result) => {
            if (!err) {

                return res.redirect('/pacientes') 
                
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
    sendEmail(data.email,0,2,data.contrasena)

});

router.post('/api/updatepatient', isValidUser,isDoctor, (req,res)=>{
    let queryString =`UPDATE usuarios SET `;

    req.body.nombre ? queryString += `Nombre = '${req.body.nombre}',` : null
    req.body.contrasena ? queryString += `Contrasena = '${req.body.contrasena}',` : null
    req.body.identificacion ? queryString += `Identificacion = '${req.body.identificacion}',` : null    
    req.body.sexo ? queryString += `Sexo = '${req.body.sexo}',` : null 
    req.body.fecha_nacimiento ? queryString += `Fecha_De_Nacimiento = '${req.body.fecha_nacimiento}',` : null
    req.body.telefono ? queryString += `Telefono = '${req.body.telefono}',` : null
    req.body.ciudad ? queryString += `Ciudad = '${req.body.ciudad}',` : null
    req.body.direccion ? queryString += `Direccion = '${req.body.direccion}',` : null
    req.body.eps ? queryString += `Eps = '${req.body.eps}',` : null
    req.body.edad ? queryString += `Edad = '${req.body.edad}',` : null
    req.body.estatura ? queryString += `Estatura = '${req.body.estatura}',` : null
    req.body.peso ? queryString += `Peso = '${req.body.peso}',` : null
    req.body.tipo_de_sangre ? queryString += `Tipo_De_Sangre = '${req.body.tipo_de_sangre}',` : null
    req.body.antecedentes ? queryString += `Antecedentes_Clinicos = '${req.body.antecedentes}',` : null

    queryString += ` Id = '${req.body.updateId}' WHERE Id = '${req.body.updateId}';`
    
    connection.query( 
                
        queryString, (err,result) => {
            if (!err) {

                return res.redirect('/pacientes') 
                
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.post('/api/deletepatient', isValidUser,isDoctor, (req,res)=>{

    const queryString = `DELETE FROM usuarios WHERE Id = ${req.body.Id}`

    connection.query( 
                
        queryString, (err,result) => {
            if (!err) {

                return res.redirect('/pacientes') 
                
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.get('/api/getpatient/:id', isValidUser, (req,res)=>{
    const queryString = `SELECT * FROM usuarios WHERE Identificacion = ${req.params.id} ;`

    connection.query( 
                
        queryString, (err,result) => {
            if (!err) {
                
                return res.send(result[0]) 
                
            } else {
                
                console.log(`Ha ocurrido el siguiente ${err}`);
                return false
            }
        }
    )
});

router.post('/api/updateState', isValidUser, isDoctor, (req,res)=>{
    let queryString =`UPDATE usuarios SET Estado = ${req.body.estado} WHERE Identificacion = ${req.body.identificacion}`;
    
    connection.query( 
                
        queryString, (err,result) => {
            if (!err) {

                return res.redirect(`/panel/${req.body.identificacion}`) 
                
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

module.exports = router