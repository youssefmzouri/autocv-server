const { Schema, model  } = require("mongoose");

const profilePictureSchema = new Schema({
    ref: String,
    image: String,
    createdAt: Date,
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
 profilePictureSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const ProfilePicture = model('ProfilePicture', profilePictureSchema);
module.exports = ProfilePicture;