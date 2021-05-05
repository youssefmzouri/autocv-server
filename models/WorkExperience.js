const { Schema, model  } = require("mongoose");

const workExperienceSchema = new Schema({
    company: String,
    title: String,
    description: String,
    employmentType: String,
    location: String,
    startDate: Date,
    endDate: Date,
    stillActive: Boolean,
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
 workExperienceSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const WorkExperience = model('WorkExperience', workExperienceSchema);
module.exports = WorkExperience;