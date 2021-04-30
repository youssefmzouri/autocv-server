const { Schema, model  } = require("mongoose");

const curriculumSchema = new Schema({
    name: String, 
    description: String,
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
 curriculumSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const Curriculum = model('Curriculum', userSchema);
module.exports = Curriculum;