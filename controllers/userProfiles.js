const userProfileRouter = require('express').Router();
const {User, UserProfile} = require('../models');
const {userExtractor} = require('../middleware');

userProfileRouter.get('/', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const userProfile = await UserProfile.find({user : userId}).populate(
        'user', {
            email: 1
        }
    );
    res.status(200).json(userProfile);
});

userProfileRouter.get('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    UserProfile.findById(id)
    .then(up => {
        if (up) {
            return res.json(up);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

userProfileRouter.post('/', userExtractor, async (req, res, next) => {
    let {
        contactEmail,
        contactPhone,
        githubUser,
        linkedinUser,
        web,
        city,
    } = req.body;

    if(!contactEmail || !contactPhone ) {
        return res.status(400).json({
            error: 'check and send the required fields'
        });
    }

    const {userId} = req;
    const user = await User.findById(userId);

    const up = new UserProfile({
        contactEmail,
        contactPhone,
        githubUser,
        linkedinUser,
        web,
        city,
        user: user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    try {
        const savedUp = await up.save();
        user.userProfiles = user.userProfiles.concat(savedUp._id);
        await user.save();
        res.status(201).json(savedUp);
    } catch(error) {
        next(error);
    }
});

userProfileRouter.put('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    const up = req.body;
    
    const newUp = {
        updatedAt: new Date().toISOString(), 
        ...up
    };

    UserProfile.findByIdAndUpdate(id, newUp, {new: true})
        .then(savedUp => {
            res.json(savedUp);
        }).catch( err => next(err));
});

userProfileRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    const {userId} = req;
    try {
        User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'userProfiles': id
            }
        }, async (err, model) => {
            await UserProfile.findByIdAndRemove(id);
            res.status(204).end();
        });
    } catch(error) {
        console.log('error deleting user profile: ', error);
        next(error);
    }
});

module.exports = userProfileRouter;