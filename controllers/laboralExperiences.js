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
    // const {userId} = req;
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

// laboralExperiencesRouter.post('/', userExtractor, async (req, res, next) => {
//     const {name, description} = req.body;
//     const isFromGithub = req.body.isFromGithub || false;
//     const githubUri = req.body.githubUri || '';

//     if(!name || !description) {
//         return res.status(400).json({
//             error: '"name" field and "description" field are requireds'
//         });
//     }

//     const {userId} = req;
//     const user = await User.findById(userId);

//     const project = new LaboralExperience({
//         name, 
//         description,
//         user: user._id,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         isFromGithub,
//         githubUri
//     });

//     try {
//         const savedProject = await project.save();
//         user.projects = user.projects.concat(savedProject._id);
//         await user.save();
//         res.status(201).json(savedProject);
//     } catch(error) {
//         next(error);
//     }
// });

// laboralExperiencesRouter.put('/:id', userExtractor, (req, res, next) => {
//     const {id} = req.params;
//     const project = req.body;
    
//     const newProject = {
//         name: project.name,
//         description: project.description,
//         isFromGithub: project.isFromGithub,
//         githubUri: project.githubUri,
//         updatedAt: new Date().toISOString()
//     };

//     LaboralExperience.findByIdAndUpdate(id, newProject, {new: true})
//         .then(savedProject => {
//             res.json(savedProject);
//         }).catch( err => next(err));
// });

laboralExperiencesRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    try {
        await LaboralExperience.findByIdAndRemove(id);
        res.status(204).end();
    } catch(error) {
        next(error);
    }
});

module.exports = laboralExperiencesRouter;