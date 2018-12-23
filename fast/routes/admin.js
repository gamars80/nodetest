var express = require('express');
var router = express.Router();

router.get('/admin', function(req,res){
	res.send('admin app');
});

router.get('/products', function(req, res){

res.render('admin/products');

});

router.get('/products/write', function(req, res){

	res.render('admin/form');

	});

module.exports = router;