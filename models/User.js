const { Schema, model  } = require("mongoose");

const userSchema = new Schema({
    email: String, 
    password: String, 
    fullName: String,
    createdAt: Date
});
const User = model('User', userSchema);

/**
 * Modifies the paremeters of result that return the mondoDB server
 * To be equal with the model defined here in the source code.
 * Thats beacuse we override the function toJSON.transform()
 */
userSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

module.exports = User;

// User.find({

// }).then(result => {
//     console.log(result);
//     mongoose.connection.close();
// })

// const user = new User({
//     email: 'youssef@email.com',
//     password: '1234',
//     fullname: 'Youssef El Mzouri',
//     createdAt: new Date()
// })

// user.save()
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close();
//     }).catch(error => {
//         console.error(error)
//     });