var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');

router.get('/', function (req, res) {
//    localStorage.clear();
    req.session.destroy(function (err) {
        res.redirect('/');
    });

});

module.exports = router;