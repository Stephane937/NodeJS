var express = require('express')
var app = express()

app.get('/', function(req, res) {
	// render to views/index.ejs template file
	res.render('index', {title: 'Mon application NODEJS : Vélib - Vélos et bornes - Disponibilité temps réel'})
})

module.exports = app;
