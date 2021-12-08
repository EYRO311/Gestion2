const express = require('express');
const router = express.Router();
const {Router} = require('express');
const routers=Router();
const fs = require('fs');

const publi = fs.readFileSync('books.json','utf-8');
const books = JSON.parse(publi);

const controller = require('../controllers/controllers');

routers.get('/new-entry',(req,res)=>{
    res.render('new-entry')
});

routers.post('/new-entry', (req,res)=>{
    const{title,area,image,description,link}=req.body;
    let newBook = {
        title,
        area,
        image,
        description,
        link
    };
    books.push(newBook);
    const json_books = JSON.stringify(books);
    fs.writeFileSync('books.json',json_books,'utf-8')
    res.redirect('/publicaciones');
});

//router para las vista
routers.get('/',controller.isAuthenticated,(req,res)=>{
    res.render('index', {
        books
    });
});

routers.get('/publicaciones',(req,res)=>{ 
    res.render('publicaciones', {
        books
    });
});

routers.get('/chat',controller.isAuthenticated,(req,res)=>{
    res.render('chat');
});

routers.get('/chat_inicio',controller.isAuthenticated,(req,res)=>{
    res.render('chat_inicio');
});
/*
router.get('/login_admin',(req,res)=>{
    res.render('login_admin', {alert:false});
});

router.get('/login_gestion',(req,res)=>{
    res.render('login_gestion', {alert:false});
});
*/
routers.get('/login',(req,res)=>{
    res.render('login', {title: 'Iniciar sesión', alert:false});
});

routers.get('/register',(req,res)=>{
    res.render('register', {title: 'Registrarse'});
});

routers.get('/admin', (req, res) => {
    res.render('admin', {title: 'Administrador'});
});
/*
router.get('/register_gestion',(req,res)=>{
    res.render('register_gestion');
});
*/
//router para metodos controller
routers.post('/register',controller.register)
routers.post('/login',controller.login)
/*
router.post('/register_gestion',controller.register_gestion)
router.post('/login_gestion',controller.login_gestion)
router.post('/login_admin',controller.login_admin)*/
routers.get('logout',controller.logout)

module.exports = routers;