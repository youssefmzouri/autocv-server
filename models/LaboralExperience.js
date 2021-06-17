const { Schema, model  } = require("mongoose");

const LaboralExperienceSchema = new Schema({
    companyName: String,
    position: String,
    startDate: Date,
    endDate: Date,
    stillActive: Boolean,
    
    companyWebPage: String,
    description: String,
    location: String,
    createdAt: Date,
    updatedAt: Date,
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
 LaboralExperienceSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

const LaboralExperience = model('LaboralExperience', LaboralExperienceSchema);
module.exports = LaboralExperience;