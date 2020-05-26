require('../DBconnection');
var mongoose = require('mongoose');

//If We will use validation in schema then If Error occur so then Our Server Will Stop .

// Setup schema
var PasswordSchema = mongoose.Schema({
    password_category_name: String,
    user_id:String,
    date_created: {
        type: Date,
        default: Date.now
    },
    date_modified: {
        type: Date
    }
},
        {versionKey: false});
var PassCateModal = mongoose.model('password_category', PasswordSchema);
module.exports = PassCateModal;