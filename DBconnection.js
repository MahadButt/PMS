
//Create a database named "firstdb":
// Connect to Mongoose and set connection variable
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mongodb:Pg2j34GgFu2Ya91R@cluster0-nb1jb.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true,useCreateIndex:true});
// Added check for DB connection
var db = mongoose.connection;
try {
    if (!db) {
        console.log("Error connecting db");
    } else {
        console.log("Db connected successfully");
    }
} catch (e) {
    console.log("Error connecting db");
}