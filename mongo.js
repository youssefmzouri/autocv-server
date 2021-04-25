const mongoose = require('mongoose');

const connectionString = process.env.MONGO_DB_URI;

// connexión a mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then( () => {
    console.log('Database connected');
}).catch( error => {
    console.log(error);
})