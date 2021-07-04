const projectsRouter = require('express').Router();
const {User, Project} = require('../models');
const {userExtractor} = require('../middleware');
const jwt = require('jsonwebtoken');

projectsRouter.get('/', userExtractor, async (req, res, next) => {
    const {userId} = req;
    const projects = await Project.find({user : userId}).populate(
        'user', {
            email: 1
        }
    );
    res.status(200).json(projects);
});

projectsRouter.get('/:id', userExtractor, (req, res, next) => {
    // const {userId} = req;
    const {id} = req.params;
    Project.findById(id)
    .then(project => {
        if (project) {
            return res.json(project);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
});

projectsRouter.post('/', userExtractor, async (req, res, next) => {
    const project = req.body;
    project.isFromGithub = req.body.isFromGithub || false;
    project.githubUri = req.body.githubUri || '';

    if (project.isFromGithub) {
        project.description = project.description ? project.description : project.full_name;
    }

    if(!project.name || !project.description) {
        return res.status(400).json({
            error: '"name" field and "description" field are requireds'
        });
    }

    if (project.id) {
        delete project.id;
    }

    const {userId} = req;
    const user = await User.findById(userId);

    const newProject = new Project({
        ...project,
        user: user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    try {
        const savedProject = await newProject.save();
        user.projects = user.projects.concat(savedProject._id);
        await user.save();
        res.status(201).json(savedProject);
    } catch(error) {
        next(error);
    }
});

projectsRouter.put('/:id', userExtractor, (req, res, next) => {
    const {id} = req.params;
    const project = req.body;
    
    const newProject = {
        ...project,
        updatedAt: new Date().toISOString()
    };

    Project.findByIdAndUpdate(id, newProject, {new: true})
        .then(savedProject => {
            res.json(savedProject);
        }).catch( err => next(err));
});

projectsRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const {id} = req.params;
    const {userId} = req;
    try {
        User.findOneAndUpdate({_id: userId}, {
            $pull: {
                'projects': id
            }
        }, async (err, model) => {
            await Project.findByIdAndRemove(id);
            res.status(204).end();
        });
    } catch(error) {
        next(error);
    }
});

module.exports = projectsRouter;