var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// afficher la liste des stations de vélos
app.get('/', function(req, res, next) {	
	// fetch and sort users collection by id in descending order
	req.db.collection('velos').find().sort({"_id": -1}).toArray(function(err, result) {
		if (err) {
			req.flash('error', err)
			res.render('velos/list', {
				title: 'Liste des velos',
				data: ''
			})
		} else {
			res.render('velos/list', {
				title: 'Liste des velos',
				data: result
			})
		}
	})
})

// ajouter une station de vélos
app.get('/add', function(req, res, next){
	res.render('velos/add', {
		title: 'Ajouter une nouvelle station de velos',
		station: '',
		nbreBornettesLibres: '',
		velosDispo: '',
		veloElectriques: '',
		veloManuelle: '',
		bornePaiement: '',
	})
})

// ADD NEW VELOS POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('station', 'Station is required').notEmpty()
	req.assert('nbreBornettesLibres', 'nbreBornettesLibres is required').notEmpty()
    req.assert('velosDispo', 'velosDispo is required').notEmpty()
	req.assert('veloElectriques', 'veloElectriques is required').notEmpty()
	req.assert('veloManuelle', 'veloManuelle is required').notEmpty()
	req.assert('bornePaiement', 'bornePaiement is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //Pas d'erreur repéres.

		var velo = {
			station: req.sanitize('station').escape().trim(),
			nbreBornettesLibres: req.sanitize('nbreBornettesLibres').escape().trim(),
			velosDispo: req.sanitize('velosDispo').escape().trim(),
			veloElectriques: req.sanitize('veloElectriques').escape().trim(),
			veloManuelle: req.sanitize('veloManuelle').escape().trim(),
			bornePaiement: req.sanitize('bornePaiement').escape().trim()
		}
				 
		req.db.collection('velos').insert(velo, function(err, result) {
			if (err) {
				req.flash('error', err)

				res.render('velos/add', {
					title: 'Add New Cycle',
					station: velo.station,
					nbreBornettesLibres: velo.nbreBornettesLibres,
					velosDispo: velo.velosDispo,
					veloElectriques: velo.veloElectriques,
					veloManuelle: velo.veloManuelle,
					bornePaiement: velo.bornePaiement,
				})
			} else {				
				req.flash('success', 'Station de vélos ajouté avec succés !')
				
				// redirect to velos list page
				res.redirect('/velos')

			}
		})		
	}
	else {   //afficher une erreur lors de l'ajout des station de vélos
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		

        res.render('velos/add', {
            title: 'Add New Cycle',
			station: req.body.station,
			nbreBornettesLibres: req.body.nbreBornettesLibres,
			velosDispo: req.body.velosDispo,
			veloElectriques: req.body.veloElectriques,
			veloManuelle: req.body.veloManuelle,
			bornePaiement: req.body.bornePaiement
        })
    }
})

// afficher la modification des stations de vélos
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('velos').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if velos not found
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/velos')
		}
		else { // if velos found
			res.render('velos/edit', {
				title: 'Edit Cycle',
				//data: rows[0],
				id: result[0]._id,
				station: result[0].station,
				nbreBornettesLibres: result[0].nbreBornettesLibres,
				velosDispo: result[0].velosDispo,
				veloElectriques: result[0].veloElectriques,
				veloManuelle: result[0].veloManuelle,
				bornePaiement: result[0].bornePaiement

			})
		}
	})	
})

// EDIT VELOS POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('station', 'station is required').notEmpty()
	req.assert('nbreBornettesLibres', 'nbreBornettesLibres is required').notEmpty()
    req.assert('velosDispo', 'A velosDispo is required').notEmpty()
	req.assert('veloElectriques', 'A veloElectriques is required').notEmpty()
	req.assert('veloManuelle', 'A veloManuelle is required').notEmpty()
	req.assert('bornePaiement', 'A bornePaiement is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {

		var velo = {
			station: req.sanitize('station').escape().trim(),
			nbreBornettesLibres: req.sanitize('nbreBornettesLibres').escape().trim(),
			velosDispo: req.sanitize('velosDispo').escape().trim(),
			veloElectriques: req.sanitize('veloElectriques').escape().trim(),
			veloManuelle: req.sanitize('veloManuelle').escape().trim(),
			bornePaiement: req.sanitize('bornePaiement').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('velos').update({"_id": o_id}, velo, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/velos/edit.ejs
				res.render('velos/edit', {
					title: 'Modifier une station de vélos',
					id: req.params.id,
					station: req.body.station,
					nbreBornettesLibres: req.body.nbreBornettesLibres,
					velosDispo: req.body.velosDispo,
					veloElectriques: req.body.veloElectriques,
					veloManuelle: req.body.veloManuelle,
					bornePaiement: req.body.bornePaiement
				})
			} else {
				req.flash('success', 'Station de vélos modifiés avec succés!')
				
				res.redirect('/velos')

			}
		})		
	}
	else {   //Afficher des erreurs lors de la modification des vélos
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)


        res.render('velos/edit', {
            title: 'Modifier la station de vélos',
			id: req.params.id,
			station: req.body.station,
			nbreBornettesLibres: req.body.nbreBornettesLibres,
			velosDispo: req.body.velosDispo,
			veloElectriques: req.body.veloElectriques,
			veloManuelle: req.body.veloManuelle,
			bornePaiement: req.body.bornePaiement

        })
    }
})

// supprimer station de velos
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('velos').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list page
			res.redirect('/velos')
		} else {
			req.flash('success', 'Station de vélos supprimés avec succés! id = ' + req.params.id)
			// redirect to users list page
			res.redirect('/velos')
		}
	})	
})

module.exports = app
