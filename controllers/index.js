const cvsRouter = require('./curriculums');
const usersRouter = require('./users');
const loginRouter = require('./login');
// const ProfilePicture = require('./profilePictures');
const projectsRouter = require('./projects');
// const Template = require('./templates');
// const UserProfile = require('./userProfiles');
// const WorkExperience = require('./workExperiences');
// const AcademicExperience = require('./academicExperiences');

module.exports = {
    cvsRouter,
    usersRouter,
    loginRouter,
    projectsRouter
}