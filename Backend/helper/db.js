var mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

module.exports = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING, {useNewUrlParser: true});

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
      });
      mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
      });

    mongoose.Promise = global.Promise;
}