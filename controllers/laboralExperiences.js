const laboralExperiencesRouter = require('express').Router();
const {User, LaboralExperience} = require('../models');
const {userExtractor} = require('../middleware');

laboralExperiencesRouter.get('/', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const projects = await LaboralExperience.find({user : userId}).populate(
        'user', {
            email: 1
        }
    );
    res.status(200).json(projects);
});

laboralExperiencesRouter.get('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    LaboralExperience.findById(id)
    .then(lexp => {
        if (lexp) {
            return res.json(lexp);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

laboralExperiencesRouter.post('/', userExtractor, async (req, res, next) => {
    let {
        companyName,
        position,
        description,
        startDate,
        endDate,
        stillActive,
        companyWebPage,
        location
    } = req.body;
    
    companyWebPage = companyWebPage || '';
    location = location || '';
    stillActive = stillActive || false;
    endDate = endDate || new Date();

    if(!companyName || !description || !position || !startDate || !endDate ) {
        return res.status(400).json({
            error: 'check and send the required fields'
        });
    }

    const {userId} = req;
    const user = await User.findById(userId);

    const exp = new LaboralExperience({
        companyName,
        position,
        description,
        user: user._id,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stillActive,
        companyWebPage,
        location
    });

    try {
        const savedExp = await exp.save();
        user.laboralExperiences = user.laboralExperiences.concat(savedExp._id);
        await user.save();
        res.status(201).json(savedExp);
    } catch(error) {
        next(error);
    }
});

laboralExperiencesRouter.put('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    const lexp = req.body;
    
    const newLexp = {
        updatedAt: new Date().toISOString(), 
        ...lexp
    };

    LaboralExperience.findByIdAndUpdate(id, newLexp, {new: true})
        .then(savedLexp => {
            res.json(savedLexp);
        }).catch( err => next(err));
});

laboralExperiencesRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    const {userId} = req;
    try {
        User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'laboralExperiences': id
            }
        }, async (err, model) => {
            await LaboralExperience.findByIdAndRemove(id);        
            res.status(204).end();
        });
    } catch(error) {
        console.log('error deleting lexp: ', error);
        next(error);
    }
});

module.exports = laboralExperiencesRouter;