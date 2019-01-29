var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var crypto = require('crypto');
var pool = require('../db_connect');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
    res.send('<a href="/login">로그인</a>');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',function(req,res){
    var id = req.body.username;
    var pw = req.body.password;
    var sql = 'select * from gd_member where id=?';
    pool.getConnection(function(err, con){
        con.query(sql,[id],function(err,results){
            if(err)
                console.log(err);
            if(!results[0])
                return res.send('please check your id');
            var user = results[0];
            
        })
    });
})
