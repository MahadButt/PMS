var express = require('express');
var router = express.Router();
var moment = require('moment');
const {check, validationResult} = require('express-validator');
var checkLogin = require('../customModules/checkToken');
var PassCateModal = require('../modals/Password_Category');
var PassDetailsModal = require('../modals/Password_Details');

router.get('/', checkLogin, function (req, res, next) {
    var username = req.session.username;
    var userId = req.decoded.user_id;
    var perPage = 5;
    var page = 1;
    PassDetailsModal.find({user_id: userId}).skip((perPage * page) - perPage).limit(perPage).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else if (!callback || callback.length === 0) {
            res.render('view_all_password', {title: 'Password Management System', loginUser: username});
        } else {
            PassDetailsModal.countDocuments({user_id: userId}).exec((err, count) => {
                res.render('view_all_password',
                        {
                            title: 'Password Management System',
                            loginUser: username,
                            data: callback,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        }
                );
            });
        }
    });
});
router.get('/:page', checkLogin, function (req, res, next) {
    var username = req.session.username;
    var userId = req.decoded.user_id;
    var perPage = 5;
    var page = req.params.page;
    PassDetailsModal.find({user_id: userId}).skip((perPage * page) - perPage).limit(perPage).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else if (!callback || callback.length === 0) {
            res.render('view_all_password', {title: 'Password Management System', loginUser: username});
        } else {
            PassDetailsModal.countDocuments({user_id: userId}).exec((err, count) => {
                res.render('view_all_password',
                        {
                            title: 'Password Management System',
                            loginUser: username,
                            data: callback,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        }
                );
            });
        }
    });
});
router.get('/edit/:id', checkLogin, function (req, res, next) {
    var username = req.session.username;
    var Id = req.params.id;
    var userId = req.decoded.user_id;
    PassCateModal.find({user_id: userId}).exec(function (err, data) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else {
            PassDetailsModal.findById(Id).exec(function (err, callback) {
                if (err) {
                    return res.status(500).send({"success": false, "msg": err.message});
                } else {
                    res.render('edit_password_details', {title: 'Password Management System', loginUser: username, data: data, result: callback});
                }
            });
        }
    });
});
router.post('/edit', checkLogin, function (req, res, next) {
    var Id = req.body.id;
    var pcname = req.body.passwordcategory;
    var pdetails = req.body.passdetails;
    var dateModified = moment().format("YYYY-MM-DD HH:mm:ss");
    PassDetailsModal.findByIdAndUpdate(Id, {password_category_name: pcname, password_details: pdetails, date_modified: dateModified}, function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else {
            res.redirect('/viewAllPassword');
        }
    });
});

router.get('/delete/:id', checkLogin, function (req, res, next) {
    var Id = req.params.id;
//    PassCateModal.remove({_id: Id}, function (err, callback) {
//PassCateModal.findByIdAndRemove(Id, function (err, callback) {
    PassDetailsModal.findByIdAndDelete(Id, function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else
        {
            if (callback) {
                res.redirect('/viewAllPassword');
            } else {
                return res.status(409).send({"success": false, "msg": "data Not deleted"});
            }
        }
    });
});
module.exports=router;