var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
var checkLogin = require('../customModules/checkToken');
var PassCateModal = require('../modals/Password_Category');

router.route('/').get(checkLogin, (req, res, next) => {
    var username = req.session.username;
    res.render('add_new_category', {title: 'Password Management System', loginUser: username});
}).post(checkLogin, [
    // password must be at least 5 chars long
    check('category', 'Enter Password Category Name').isLength({min: 1})
], (req, res, next) => {
    const errors = validationResult(req);
    var username = req.session.username;
    if (!errors.isEmpty()) {
        res.status(403).render('add_new_category', {title: 'Password Management System', loginUser: username, errors: errors.mapped()});
    } else {
        var passcatename = req.body.category;
        var userId = req.decoded.user_id;
        var PasswordCate = new PassCateModal({
            password_category_name: passcatename,
            user_id: userId
        });
        PasswordCate.save(function (err, callback) {
            try {
                if (err) {
                    return res.status(500).send({"success": false, "msg": err.message});
                } else {
                    res.render('add_new_category', {title: 'Password Management System', loginUser: username, successResponse: "Password Category Inserted Successfully"});
                }
            } catch (err) {
                return res.status(500).send({"success": false, "msg": err.message});
            }
        });
    }
});
module.exports = router;