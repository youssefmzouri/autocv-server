const cvsRouter = require('./curriculums');
const usersRouter = require('./users');
const loginRouter = require('./login');
const githubRouter = require('./github');
const profilePictureRouter = require('./profilePictures');
const projectsRouter = require('./projects');
// const Template = require('./templates');
const userProfileRouter = require('./userProfiles');
const laboralExperiencesRouter = require('./laboralExperiences');
const academicExperienceRouter = require('./academicExperiences');

module.exports = {
    cvsRouter,
    usersRouter,
    loginRouter,
    projectsRouter,
    laboralExperiencesRouter,
    academicExperienceRouter,
    userProfileRouter,
    profilePictureRouter,
    githubRouter
}