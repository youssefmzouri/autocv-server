const pdf = require('html-pdf');
const { get } = require('../controllers/curriculums');
const {stylesTemplate} = require('../utils/pdfStyles');

const generateContent = (cv) => {
    const {
        user, projects,
        userProfile, profilePicture, 
        laboralExperiences, academicExperiences
    } = cv;

    const getFullName = () => {
        return `${user.name} ${user.lastName}`;
    }

    const printProjects = () => {
        let toReturn = ``;
        projects.forEach(pr => {
            toReturn += `
                <div class="job">
                    <h2>${pr.name}</h2>
                    <h3>${pr.githubUri}</h3>
                    <p>${pr.description}</p>
                </div>
            `;
        });
        return toReturn;
    }

    const transformDate = dateParam => {
        const date = new Date(dateParam);
        return parseInt(date.getMonth()+1) +"/"+date.getFullYear()
    };

    const printLaboralExperience = () => {
        let toReturn = ``;
        laboralExperiences.forEach(exp => {
            toReturn += `
                <div class="job">
                    <h2>${exp.companyName} - (${exp.companyWebPage})</h2>
                    <h3>${exp.position}</h3>
                    <h4>${transformDate(exp.startDate)} - ${!exp.stillActive ? transformDate(exp.endDate) : 'Actually'}</h4>
                    <p>${exp.description}</p>
                </div>
            `;
        });
        return toReturn;
    }

    const printAcademicExperience = () => {
        let toReturn = ``;
        academicExperiences.forEach(exp => {
            toReturn += `
                <div class="job">
                    <h2>${exp.school}</h2>
                    <h3>${exp.degree} &mdash; ${!exp.stillActive ? transformDate(exp.endYear) : 'In process'} </h3>
                </div>
            `;
        });
        return toReturn;
    }

    return `
    <!doctype html>
    <html>
    <head>
        <title>${getFullName()} | ${userProfile.contactEmail} </title>
        <meta charset=utf-8" />    
        <style type="text/css">
            ${stylesTemplate}
        </style>
    
    </head>
    <body>
        <div id="doc2" class="yui-t7">
            <div id="inner">
            
                <div id="hd">
                    <div class="yui-gc">
                        <div class="yui-u first">
                            <h1>${getFullName()}</h1>
                            <div class="contact-info">
                                <h3><a href="mailto:${userProfile.contactEmail}">${userProfile.contactEmail}</a></h3>
                                <h3>${userProfile.contactPhone}</h3>
                                <h3>Github: @${userProfile.githubUser}</h3>
                                <h3>Linkedin: @${userProfile.linkedinUser}</h3>
                                <h3>Web: ${userProfile.web}</h3>
                                <h3>City: ${userProfile.city}</h3>
                            </div><!--// .contact-info -->
                        </div>
                        <img src="${profilePicture.image}" alt="${profilePicture.ref}" style="max-width:150px; height:auto; margin-left: -25px;" />
                    </div><!--// .yui-gc -->
                </div><!--// hd -->
        
                <div id="bd">
                    <div id="yui-main">
                        <div class="yui-b">

                            <div class="yui-gf">
                                <div class="yui-u first">
                                    <h2>Projects</h2>
                                </div><!--// .yui-u -->
                                <div class="yui-u">
                                    ${printProjects()}
                                </div><!--// .yui-u -->
                            </div><!--// .yui-gf -->


                            <div class="yui-gf">
                                <div class="yui-u first">
                                    <h2>Laboral Experience</h2>
                                </div><!--// .yui-u -->
                                <div class="yui-u">
                                    ${printLaboralExperience()}        
                                </div><!--// .yui-u -->
                            </div><!--// .yui-gf -->
        
        
                            <div class="yui-gf last">
                                <div class="yui-u first">
                                    <h2>Education</h2>
                                </div>
                                <div class="yui-u">
                                    ${printAcademicExperience()}
                                </div>
                            </div><!--// .yui-gf -->
        
                        </div><!--// .yui-b -->
                    </div><!--// yui-main -->
                </div><!--// bd -->
        
                <div id="ft">
                    <p>${getFullName()} &mdash; <a href="mailto:${userProfile.contactEmail}">${userProfile.contactEmail}</a> &mdash; ${userProfile.contactPhone}</p>
                </div><!--// footer -->
        
            </div><!-- // inner -->
        
        
        </div><!--// doc -->
        </body>
    </html>
    `;
}

const createPDF = (cv, callback) => {
    const content = generateContent(cv);
    const pathName = `./output/${cv.id}.pdf`;

    pdf.create(content,{}).toFile(pathName, (error, result) => {
        if (error){
            console.log(error);
        } else {
            callback(pathName, result);
        }
    });
}

module.exports = {
    createPDF
}