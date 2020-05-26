var config = require('../config/main');
var jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    // decode token
//    var token = localStorage.getItem('usertoken');
   var token = req.session.usertoken;
    try {
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    res.redirect('/');
                } else {
                    req.decoded=decoded.user;
                    next();
                }
            });
        } else {
            // if there is no token
           res.redirect('/');
        }
    } catch (e)
    {
        //console.log('Token Exception occure');
       res.redirect('/');
    }
};