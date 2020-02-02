var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var contactSchema = new Schema({
    namesurname: String,
    mail: String,
    title: String,  
    content: String,
    isRead: String,
});

module.exports = mongoose.model("contact", contactSchema);