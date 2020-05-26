require('../DBconnection');
var mongoose = require('mongoose');

//If We will use validation in schema then If Error occur so then Our Server Will Stop .

// Setup schema
var PasswordSchema = mongoose.Schema({
    password_category_name: String,
    password_details: String,
    user_id: String,
    date_created: {
        type: Date,
        default: Date.now
    },
    date_modified: {
        type: Date
    }
},
        {versionKey: false});
var PassDetailModal = mongoose.model('password_details', PasswordSchema);
module.exports = PassDetailModal;