const cvsRouter = require('express').Router();
const {User, Curriculum} = require('../models');
const {userExtractor} = require('../middleware');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const pdfManager = require('../services/pdfManager');

cvsRouter.get('/', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const populateUser = {path: 'user', select: 'email name lastName'};
    const cvs = await Curriculum.find({user : userId})
        .populate(populateUser);
    res.status(200).json(cvs);
});

cvsRouter.get('/:id', userExtractor, (req, res, next) => {
    const {userId} = req;
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


cvsRouter.get('/:id/populated', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const {id} = req.params;
    try {
        const populateUser = {path: 'user', select: 'email name lastName'};
        const cv = await Curriculum.findById(id)
            .populate(populateUser)
            .populate('laboralExperiences')
            .populate('projects')
            .populate('academicExperiences')
            .populate('userProfile')
            .populate('profilePicture');
        if (cv) {
            return res.json(cv);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
});


cvsRouter.get('/:id/export/pdf', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const {id} = req.params;
    try {
        const populateUser = {path: 'user', select: 'email name lastName'};
        const cv = await Curriculum.findById(id)
            .populate(populateUser)
            .populate('laboralExperiences')
            .populate('projects')
            .populate('academicExperiences')
            .populate('userProfile')
            .populate('profilePicture');
        if (cv) {
            pdfManager.createPDF(cv, (path, fileResult) => {
                const file = fs.createReadStream(path);
                const stat = fs.statSync(path);
                
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
                file.pipe(res);
            });
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
});

cvsRouter.post('/', userExtractor, async (req, res, next) => {
    const {name, description, language = 'es'} = req.body;

    if(!name) {
        return res.status(400).json({
            error: '"name" field are required'
        });
    }

    const {userId} = req;

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

cvsRouter.put('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    const cv = req.body;
    
    const newCV = {
        ...cv,
        updatedAt: new Date().toISOString()
    };

    Curriculum.findByIdAndUpdate(id, newCV, {new: true})
        .then(savedCV => {
            res.json(savedCV);
        }).catch( err => next(err));
});

cvsRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    const {userId} = req;
    try {
        User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'cvs': id
            }
        }, async (err, model) => {
            await Curriculum.findByIdAndRemove(id);
            res.status(204).end();
        });
    } catch(error) {
        next(error);
    }
});

module.exports = cvsRouter;