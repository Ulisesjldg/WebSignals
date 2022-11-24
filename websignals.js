const express = require ('express');
const morgan = require('morgan');
const cookieParse = require ('cookie-parser');
const path = require('path')
const session = require('express-session')
const dotenv = require('dotenv');
dotenv.config()


const app = express();

const oneMonth = 1000 * 60 * 60 * 24 * 30;

app.use(session({
    secret: 'hohohohohohohoasnj27168767821bkjxbjfiasbkjnsdalnhfjkld',
    saveUninitialized:true,
    cookie: { 
        httpOnly: true,
        maxAge: oneMonth },
    resave: false
}));

//Puerto 
app.set('port', process.env.PORT || 3020);
app.use(morgan('dev'));

//Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Carpeta Public
app.use(express.static(path.join(__dirname, 'public')));

//Procesar datos enviados desde formularios
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Variables de entorno
// dotenv.config({path: './env/.env'});

//Cokies
app.use(cookieParse());

// llamar al router
app.use('/', require ('./routes/routes' ));

//Servidor on
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});




