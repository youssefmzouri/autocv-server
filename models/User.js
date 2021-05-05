const { Schema, model  } = require("mongoose");

const userSchema = new Schema({
    email: String, 
    passwordHash: String, 
    fullName: String,
    createdAt: Date,
    cvs: [{
        type: Schema.Types.ObjectId,
        ref: 'Curriculum'
    }],
    userProfiles: [{
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    }],
    profilePictures: [{
        type: Schema.Types.ObjectId,
        ref: 'ProfilePicture'
    }],
    templates: [{
        type: Schema.Types.ObjectId,
        ref: 'Template'
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

/**
 * Modifies the paremeters of result that return the mondoDB server
 * To be equal with the model defined here in the source code.
 * Thats beacuse we override the function toJSON.transform()
 */
 userSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});


const User = model('User', userSchema);
module.exports = User;