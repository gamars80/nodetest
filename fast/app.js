process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

var express = require('express');
var path = require('path');
var logger= require('morgan');
var bodyParser = require('body-parser'); 
var admin = require('./routes/admin');
//상품리스트 게시판~!
var productRouter = require('./routes/product');



var app = express();
var port = 3000;




app.get('/', function(req,res){
	res.send('first app');
});

//express에 아래 모듈을 사용하겠다고 호출하는 부분
app.use(bodyParser.json()); // Json Parser
app.use(bodyParser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(admin);
app.use(productRouter);

app.listen( port, function(){
console.log('Express listening on port', port);
});