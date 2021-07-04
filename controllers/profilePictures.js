const profilePicturesRouter = require('express').Router();
const {User, ProfilePicture} = require('../models');
const {userExtractor} = require('../middleware');

profilePicturesRouter.get('/', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const profilePicture = await ProfilePicture.find({user : userId}).populate(
        'user', {
            email: 1
        }
    );
    res.status(200).json(profilePicture);
});

profilePicturesRouter.get('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    ProfilePicture.findById(id)
    .then(image => {
        if (image) {
            return res.json(image);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

profilePicturesRouter.post('/', userExtractor, async (req, res, next) => {
    let {
        ref,
        image,
    } = req.body;

    if(!ref || !image ) {
        return res.status(400).json({
            error: 'check and send the required fields'
        });
    }

    const {userId} = req;
    const user = await User.findById(userId);

    const picture = new ProfilePicture({
        image,
        ref,
        user: user._id,
        createdAt: new Date().toISOString()
    });

    try {
        const savedPicture = await picture.save();
        user.profilePictures = user.profilePictures.concat(savedPicture._id);
        await user.save();
        res.status(201).json(savedPicture);
    } catch(error) {
        next(error);
    }
});

profilePicturesRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    const {userId} = req;
    // console.log('Try to delete image with id: ', id);
    try {
        User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'profilePictures': id
            }
        }, async (err, model) => {
            if (!err) {
                await ProfilePicture.findByIdAndRemove(id);
                res.status(204).end();
            } else {
                throw(err);
            }
        });
    } catch(error) {
        console.log('error deleting profile picture: ', error);
        next(error);
    }
});

module.exports = profilePicturesRouter;