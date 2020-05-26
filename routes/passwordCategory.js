var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
var checkLogin = require('../customModules/checkToken');
var PassCateModal = require('../modals/Password_Category');


router.get('/', checkLogin, function (req, res, next) {
    var username = req.session.username;
    var userId = req.decoded.user_id;
    var perPage = 5;
    var page = 1;
    PassCateModal.find({user_id: userId}).skip((perPage * page) - perPage).limit(perPage).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else if (!callback || callback.length === 0) {
            res.render('password_category', {title: 'Password Management System', loginUser: username});
        } else {
            PassCateModal.countDocuments({user_id: userId}).exec((err, count) => {
                res.render('password_category',
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
    PassCateModal.find({user_id: userId}).skip((perPage * page) - perPage).limit(perPage).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else if (!callback || callback.length === 0) {
            res.render('password_category', {title: 'Password Management System', loginUser: username});
        } else {
            PassCateModal.countDocuments({user_id: userId}).exec((err, count) => {
                res.render('password_category',
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
    PassCateModal.findById(Id).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else {
            res.render('edit_category', {title: 'Password Management System', loginUser: username, data: callback});
        }
    });
});
router.post('/edit', checkLogin, function (req, res, next) {
    var Id = req.body.id;
    var pcname = req.body.category;
    PassCateModal.findByIdAndUpdate(Id, {password_category_name: pcname}, function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else {
            res.redirect('/passwordCategory');
        }
    });
});

router.get('/delete/:id', checkLogin, function (req, res, next) {
    var Id = req.params.id;
//    PassCateModal.remove({_id: Id}, function (err, callback) {
//PassCateModal.findByIdAndRemove(Id, function (err, callback) {
    PassCateModal.findByIdAndDelete(Id, function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else
        {
            if (callback) {
                res.redirect('/passwordCategory');
            } else {
                return res.status(409).send({"success": false, "msg": "data Not deleted"});
            }
        }
    });
});
module.exports=router;