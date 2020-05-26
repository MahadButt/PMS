var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
var checkLogin = require('../customModules/checkToken');

router.get('/', checkLogin, function (req, res) {
    var username = req.session.username;
//    var username = localStorage.getItem('username');
    res.render('dashboard', {title: 'Password Management System', loginUser: username});
});

module.exports = router;