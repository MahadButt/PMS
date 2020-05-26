var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require('moment');
const {check, validationResult} = require('express-validator');
var config = require('../config/main');
var User = require('../modals/Users');

/* GET home page. */
router.route('/').get((req, res) => {
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
        // if there is no token
        res.render('login', {title: 'Password Management System'});
    }
}).post((req, res) => {
    try {
        var email = "";
        var password = "";

        email = req.body.user_email;
        password = req.body.user_password;
        session = req.session;
        User.findOne({user_email: email}, function (err, callback) {
            try {
                if (err) {
//                    console.log(err.message);
                    return res.status(500).send({"success": false, "msg": err.message});
                } else if (!callback || callback.length === 0) {
                    res.render('login', {title: 'Password Management System', msg: "User Not Exist"});
                } else {
                    var dbPassword = callback.user_password;
                    var result = bcrypt.compareSync(password, dbPassword);
                    if (result) {
                        var dateCreated = moment().format("YYYY-MM-DD HH:mm:ss");
                        var userObjt = {
                            user_id: callback._id,
                            user_name: callback.user_name,
                            dateCreated: dateCreated
                        };
                        var tokendata = {user: userObjt};
                        var token = jwt.sign(tokendata, config.secret, {
                            expiresIn: 1 + 'd'
                        });
//                        localStorage.setItem('username', userObjt.user_name);
//                        localStorage.setItem('usertoken', token);
                        session.username = userObjt.user_name;
                        session.usertoken = token;
                        res.redirect('dashboard');
                    } else {
//                        console.log("Password not match");
                        res.render('login', {title: 'Password Management System', msg: "Password not correct"});
                    }
                }
            } catch (ex) {
//                console.log(ex.message);
                return res.status(500).send({"success": false, "msg": ex.message});
            }
        });
    } catch (e) {
//        console.log(e.message);
        return res.status(500).send({"success": false, "msg": e.message});
    }
});


module.exports = router;
