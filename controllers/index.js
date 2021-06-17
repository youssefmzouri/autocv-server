const cvsRouter = require('./curriculums');
const usersRouter = require('./users');
const loginRouter = require('./login');
const githubRouter = require('./github');
// const ProfilePicture = require('./profilePictures');
const projectsRouter = require('./projects');
// const Template = require('./templates');
// const UserProfile = require('./userProfiles');
const laboralExperiencesRouter = require('./laboralExperiences');
// const AcademicExperience = require('./academicExperiences');

module.exports = {
    cvsRouter,
    usersRouter,
    loginRouter,
    projectsRouter,
    laboralExperiencesRouter,
    githubRouter
}