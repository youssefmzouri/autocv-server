const academicExperiencesRouter = require('express').Router();
const {User, AcademicExperience} = require('../models');
const {userExtractor} = require('../middleware');

academicExperiencesRouter.get('/', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const acaExps = await AcademicExperience.find({user : userId}).populate(
        'user', {
            email: 1
        }
    );
    res.status(200).json(acaExps);
});

academicExperiencesRouter.get('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    AcademicExperience.findById(id)
    .then(acaExp => {
        if (acaExp) {
            return res.json(acaExp);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

academicExperiencesRouter.post('/', userExtractor, async (req, res, next) => {
    let {
        school,
        degree,
        stillActive,
        endYear,
    } = req.body;
    
    endYear = endYear || new Date();

    if(!school || !degree ) {
        return res.status(400).json({
            error: 'check and send the required fields'
        });
    }

    const {userId} = req;
    const user = await User.findById(userId);

    const exp = new AcademicExperience({
        school,
        degree,
        stillActive,
        endYear,
        user: user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    try {
        const savedExp = await exp.save();
        user.academicExperiences = user.academicExperiences.concat(savedExp._id);
        await user.save();
        res.status(201).json(savedExp);
    } catch(error) {
        next(error);
    }
});

academicExperiencesRouter.put('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    const acaExp = req.body;
    
    const newAcaExp = {
        updatedAt: new Date().toISOString(), 
        ...acaExp
    };

    AcademicExperience.findByIdAndUpdate(id, newAcaExp, {new: true})
        .then(savedAcaExp => {
            res.json(savedAcaExp);
        }).catch( err => next(err));
});

academicExperiencesRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    const {userId} = req;
    try {
        User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'academicExperiences': id
            }
        }, async (err, model) => {
            await AcademicExperience.findByIdAndRemove(id);        
            res.status(204).end();
        });
    } catch(error) {
        console.log('error deleting academic experience: ', error);
        next(error);
    }
});

module.exports = academicExperiencesRouter;