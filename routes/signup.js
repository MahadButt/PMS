var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
var config = require('../config/main');
var User = require('../modals/Users');


function Checkemail(req, res, next) {
    var email = req.body.user_email;
    User.findOne({user_email: email}, function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else if (!callback || callback.length === 0) {
            next();
        } else {
            res.render('signup', {title: 'Password Management System', msg: "Email Already Exist"});
        }
    });
}
router.route('/').get((req, res, next) => {
    var token = req.session.usertoken;
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.render('login', {title: 'Password Management System'});
            } else {
                res.redirect('/dashboard');
            }
        });
    } else {
        res.render('signup', {title: 'Password Management System'});
    }
}).post(Checkemail, (req, res, next) => {
    try {
        var username = "";
        var email = "";
        var password = "";
        var cpassword = "";
        username = req.body.user_name;
        email = req.body.user_email;
        password = req.body.user_password;
        cpassword = req.body.user_cpassword;
        if (password !== cpassword) {
            res.render('signup', {title: 'Password Management System', msg: "Password not matched"});
        } else {
            var user = new User({
                user_name: username,
                user_email: email,
                user_password: bcrypt.hashSync(password)
            });
            user.save(function (err, callback) {
                try {
                    if (err) {
                        return res.status(500).send({"success": false, "msg": err.message});
                    } else {
                        res.render('signup', {title: 'Password Management System', successResponse: "User Registerd Successfully"});
                    }
                } catch (err) {
                    return res.status(500).send({"success": false, "msg": err.message});
                }
            });
        }
    } catch (err) {
        return res.status(500).send({"success": false, "msg": err.message});
    }
});

module.exports = router;