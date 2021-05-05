const cvsRouter = require('express').Router();
const {User, Curriculum} = require('../models');

cvsRouter.get('/', async (_, res, next) => {
    const cvs = await Curriculum.find({}).populate(
        'user', {
            email: 1,
            fullName: 1
        }
    );
    res.status(200).json(cvs);
});

cvsRouter.get('/:id', (req, res, next) => {
    const {id} = req.params;
    Curriculum.findById(id)
    .then(cv => {
        if (cv) {
            return res.json(cv);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

cvsRouter.post('/', async (req, res, next) => {
    console.log("POST curriculums");
    const {name, description, language = 'es', userId} = req.body;
    
    if(!name || !userId) {
        return res.status(400).json({
            error: '"name" and "userId" fields are requireds'
        });
    }

    const user = await User.findById(userId);

    const cv = new Curriculum({
        name, 
        description,
        language,
        user: user._id,
        createdAt: new Date().toISOString()
    });

    try {
        const savedCV = await cv.save();
        user.cvs = user.cvs.concat(savedCV._id);
        await user.save();
        res.status(201).json(savedCV);
    } catch(error) {
        next(error);
    }
});

cvsRouter.put('/:id', (req, res, next) => {
    const {id} = req.params;
    const cv = req.body;
    
    const newCV = {
        name: cv.name,
        description: cv.description,
        language: cv.language
    };

    Curriculum.findByIdAndUpdate(id, newCV, {new: true})
        .then(savedCV => {
            res.json(savedCV);
        }).catch( err => next(err));
});

cvsRouter.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        await Curriculum.findByIdAndRemove(id);
        res.status(204).end();
    } catch(error) {
        next(error);
    }
});

module.exports = cvsRouter;