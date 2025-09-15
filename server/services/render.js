const axios = require('axios');//http client used for making client & server side http requests in node
const PORT = process.env.PORT || 3100; //uses either what's in our env or 3100 as our port (you can use any unused port)
const BASE_URI = process.env.BASE_URI || 'http://localhost'; //uses either what's in our env or 3100 as our port (you can use any unused port)

exports.home = function (req, res) {
    res.render('index', { title: `Home` });
}

exports.addDrug = function (req, res) {//this listens for a get request for "/add-drug" from any hyperlink
    res.render('add_drug', { title: `Add Drug` }); //tells server to respond with add_drug.ejs (.ejs is optional)
}

exports.updateDrug = function (req, res) {
    axios.get(`${BASE_URI}:${PORT}/api/drugs`, { params: { id: req.query.id } })//request a drug from the database using the id
        .then(function (response) {
            res.render("update_drug", { drug: response.data, title: `Edit Drug` })//add drug data when rendering update form
        })
        .catch(err => {
            res.send(err);
        })
}

exports.manage = function (req, res) {
    // Make a get request to /api/users
    axios.get(`${BASE_URI}:${PORT}/api/drugs`)//get request to pull drugs
        .then(function (response) {
            res.render('manage', { drugs: response.data, title: 'Manage drug info' });// response from API request stored as drugs to display on manage.ejs
        })
        .catch(err => {
            res.send(err);
        })
}

exports.dosage = function (req, res) {
    // Make a get request to /api/users
    axios.get(`${BASE_URI}:${PORT}/api/drugs`)//get request to pull drugs
        .then(function (response) {
            res.render('dosage', { drugs: response.data, title: 'Check Dosage' });// response from API request stored as drugs to display on manage.ejs
        })
        .catch(err => {
            res.send(err);
        })
}

exports.purchase = function (req, res) {
    // Make a get request to /api/users
    axios.get(`${BASE_URI}:${PORT}/api/drugs`)//get request to pull drugs
        .then(function (response) {
            res.render('purchase', { drugs: response.data, title: 'Purchase Drugs', days: 30 });// response from API request stored as drugs to display on manage.ejs
        })
        .catch(err => {
            res.send(err);
        })
}

exports.purchaseWithDays = function (req, res) {
    console.log('=== purchaseWithDays called ===');
    console.log('req.body:', req.body);
    console.log('req.body.days:', req.body.days);

    const days = parseInt(req.body.days) || 30; // Parse thành số và mặc định là 30
    console.log('Final days value:', days);

    // Make a get request to /api/drugs
    axios.get(`${BASE_URI}:${PORT}/api/drugs`)
        .then(function (response) {
            console.log('Rendering with days:', days);
            res.render('purchase', { drugs: response.data, title: 'Purchase Drugs', days: days });
        })
        .catch(err => {
            console.error('Error fetching drugs:', err);
            res.send(err);
        })
}

