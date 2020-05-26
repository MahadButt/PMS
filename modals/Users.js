require('../DBconnection');
var mongoose = require('mongoose');

//If We will use validation in schema then If Error occur so then Our Server Will Stop .
 
// Setup schema
var UserSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    user_password: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    date_modified: {
        type: Date
    }
},
        {versionKey: false});
var User = mongoose.model('users', UserSchema);
module.exports = User;