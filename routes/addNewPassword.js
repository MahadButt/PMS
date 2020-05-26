var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
var checkLogin = require('../customModules/checkToken');
var PassCateModal = require('../modals/Password_Category');
var PassDetailsModal = require('../modals/Password_Details');

router.route('/').get(checkLogin, function (req, res, next) {
    var username = req.session.username;
    var userId = req.decoded.user_id;
    PassCateModal.find({user_id: userId}).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else if (!callback || callback.length === 0) {
            res.render('add_new_password', {title: 'Password Management System', loginUser: username});
        } else {
            res.render('add_new_password', {title: 'Password Management System', loginUser: username, data: callback});
        }
    });
}).post(checkLogin, [
    // password must be at least 5 chars long
    check('passwordcategory', 'Enter Password Category Name').isLength({min: 1})
], (req, res, next) => {
    const errors = validationResult(req);
    var username = req.session.username;
    var passcategory = req.body.passwordcategory;
    var passdetails = req.body.passdetails;
    var userId = req.decoded.user_id;
    PassCateModal.find({user_id: userId}).exec(function (err, callback) {
        if (err) {
            return res.status(500).send({"success": false, "msg": err.message});
        } else {
            if (!errors.isEmpty()) {
                res.status(403).render('add_new_password', {title: 'Password Management System', loginUser: username, errors: errors.mapped(), data: callback});
            } else {
                PassDetailsModal.find({user_id: userId, password_category_name: passcategory}).exec(function (err, data) {
                    if (err) {
                        return res.status(500).send({"success": false, "msg": err.message});
                    } else if (!data || data.length === 0) {
                        var PasswordDetails = new PassDetailsModal({
                            password_category_name: passcategory,
                            password_details: passdetails,
                            user_id: userId
                        });
                        PasswordDetails.save(function (err, response) {
                            try {
                                if (err) {
                                    return res.status(500).send({"success": false, "msg": err.message});
                                } else {
                                    res.render('add_new_password', {title: 'Password Management System', loginUser: username, successResponse: "Password Details Inserted Successfully", data: callback});
                                }
                            } catch (err) {
                                return res.status(500).send({"success": false, "msg": err.message});
                            }
                        });
                    } else {
                        res.render('add_new_password', {title: 'Password Management System', loginUser: username, msg: "Password Already Exist For this Category", data: callback});
                    }
                });
            }
        }
    });
});
module.exports=router;