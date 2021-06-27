const { Schema, model  } = require("mongoose");

const userProfileSchema = new Schema({
    linkedinUSer: String,
    githubUser: String,
    web: String,
    phone: String,
    city: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

/**
 * Modifies the paremeters of result that return the mondoDB server
 * To be equal with the model defined here in the source code.
 * Thats beacuse we override the function toJSON.transform()
 */
 userProfileSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const UserProfile = model('UserProfile', userProfileSchema);
module.exports = UserProfile;