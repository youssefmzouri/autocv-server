const { Schema, model  } = require("mongoose");

const academicExperienceSchema = new Schema({
    school: String,
    degree: String,
    description: String,
    startYear: Date,
    endYear: Date,
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
 academicExperienceSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const AcademicExperience = model('AcademicExperience', academicExperienceSchema);
module.exports = AcademicExperience;