const { Schema, model  } = require("mongoose");

const projectSchema = new Schema({
    name: String,
    description: String,
    githubLink: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cv: [{
        type: Schema.Types.ObjectId,
        ref: 'Curriculum'
    }]
});

/**
 * Modifies the paremeters of result that return the mondoDB server
 * To be equal with the model defined here in the source code.
 * Thats beacuse we override the function toJSON.transform()
 */
 projectSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const Project = model('Project', projectSchema);
module.exports = Project;