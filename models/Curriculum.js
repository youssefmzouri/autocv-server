const { Schema, model  } = require("mongoose");

const curriculumSchema = new Schema({
    name: String,
    description: String,
    language: String,
    createdAt: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userProfile: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    profilePicture : {
        type: Schema.Types.ObjectId,
        ref: 'ProfilePicture'
    },
    template: {
        type: Schema.Types.ObjectId,
        ref: 'Template'
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    workExperiences: [{
        type: Schema.Types.ObjectId,
        ref: 'WorkExperience'
    }],
    academicExperiences: [{
        type: Schema.Types.ObjectId,
        ref: 'AcademicExperience'
    }]
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

const Curriculum = model('Curriculum', curriculumSchema);
module.exports = Curriculum;