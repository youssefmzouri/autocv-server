const { Schema, model  } = require("mongoose");

const projectSchema = new Schema({
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date,
    isFromGithub: Boolean,
    githubUri: String,
    stargazers_count: Number,
    forks: Number,
    watchers: Number,
    private: Boolean,
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
 projectSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const Project = model('Project', projectSchema);
module.exports = Project;