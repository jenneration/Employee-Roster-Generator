const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const teamMembers = [];

const validator = require("email-validator");
//Regex variables for input validation
const officeNumCk = /^(100|[1-9][0-9]?)$/; //numbers only, 1 to 100
//const emailCk = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
const idNumCk = /^[0-9]*$/;

//Initializing function that creates the team manager
function createManager() {
    console.log("Hello! Let's build a team roster!\n"); // Add second line on a time interval and directly address the manager
    inquirer.prompt([{
            type: "input",
            message: "Please enter manager's name:",
            name: "name",
            validate: (name) => {
                if (!name || name.length < 2) {
                    console.log("\nPlease enter manager's name:");
                } else {
                    return true;
                };
            }
        },
        {
            type: "input",
            message: "Enter your i.d. number:",
            name: "id",
            validate: (id) => {
                if (!id || id.length === 0 || idNumCk.test(id) === false) {
                    console.log("\nPlease enter manager's id number:");
                } else {
                    return true;
                };
            }
        },
        {
            type: "input",
            message: "Enter your email:",
            name: "email",
            validate: (email) => {
                if (validator.validate(email) === true) {
                    return true;
                } else {
                    console.log("\nPlease enter a valid email:");
                };
            }
        },
        {
            type: "input",
            message: "Enter manager's office number:",
            name: "officeNumber",
            validate: (officeNumber) => {
                if (officeNumCk.test(officeNumber)) {
                    return true;
                } else {
                    console.log("\nOffice numbers range from 1 - 100. **IF NO OFFICE NUMBER ENTER '1'.");
                };
            }
        }
    ]).then(function(answers) {
        const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        teamMembers.push(manager);
        //console.log(teamMembers); 
        createTeamMembers();
    });
};

//Pivot function passed to each team member function. Asks if another team member is to be added or not.
function createTeamMembers() {
    inquirer.prompt([{
        type: "list",
        message: "Would you like to add another member to the team roster?",
        choices: ["Engineer", "Intern", "No I'm done."],
        name: "team"
    }]).then(function(answers) {
        switch (answers.team) {
            case "Engineer":
                createEngineer()
                break;
            case "Intern":
                createIntern()
                break;
            case "No, I'm done.":
                renderTeamRoster()
                break;
            default:
                renderTeamRoster();
        }
    });
};

//Creates the Engineer(s) 
function createEngineer() {
    console.log("\nPlease enter information about this engineer.");
    inquirer.prompt([{
            type: "input",
            message: "What is the engineer's name?",
            name: "name",
            validate: (name) => {
                if (!name || name.length < 2) {
                    console.log("\nPlease enter engineer's name:");
                } else {
                    return true;
                };
            }
        },
        {
            type: "input",
            message: "Enter engineer i.d. number:",
            name: "id",
            validate: (id) => {
                if (!id || id.length === 0 || idNumCk.test(id) === false) {
                    console.log("\nPlease enter manager's id number:");
                } else {
                    return true;
                };
            }
        },
        {
            type: "input",
            message: "Enter engineer email:",
            name: "email",
            validate: (email) => {
                if (validator.validate(email) === true) {
                    return true;
                } else {
                    console.log("\nPlease enter a engineer's email:");
                };
            }
        },
        {
            type: "input",
            message: "Enter engineer's GitHub username:",
            name: "github",
            validate: (github) => {
                if (!github || github.length === 0) {
                    console.log("\nPlease enter engineer's GitHub username:");
                } else {
                    return true;
                };
            }
        }
    ]).then(function(answers) {
        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
        teamMembers.push(engineer);
        // console.log(teamMembers);
        createTeamMembers();
    });
};

//Creates the intern(s)
function createIntern() {
    console.log("\nPlease enter information about this intern.")
    inquirer.prompt([{
            type: "input",
            message: "What is the intern's name?",
            name: "name",
            validate: (name) => {
                if (!name || name.length < 2) {
                    console.log("\nPlease enter manager's name:");
                } else {
                    return true;
                };
            }
        },
        {
            type: "input",
            message: "Enter intern i.d. number:",
            name: "id",
            validate: (id) => {
                if (!id || id.length === 0 || idNumCk.test(id) === false) {
                    console.log("\nPlease enter manager's id number:");
                } else {
                    return true;
                };
            }
        },
        {
            type: "input",
            message: "Enter intern email:",
            name: "email",
            validate: (email) => {
                if (validator.validate(email) === true) {
                    return true;
                } else {
                    console.log("\nPlease enter a valid email:");
                };
            }
        },
        {
            type: "input",
            message: "Enter name of intern's school:",
            name: "school",
            validate: (school) => {
                if (!school || school.length < 2) {
                    console.log("\nPlease enter name of intern's school:");
                } else {
                    return true;
                };
            }
        }
    ]).then(function(answers) {
        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        teamMembers.push(intern);
        //console.log(teamMembers); 
        createTeamMembers();
    });
};

//Renders the team roster.
function renderTeamRoster() {
    //Checks if an output folder exists and if not, creates one.
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    //Calls the render function with teamMembers passed to write to an html file.
    fs.writeFile(outputPath, render(teamMembers), function(err) {
        if (err) throw err;
        console.log("Your employee roster has been generated!");
    });
};

//Initializes the createManager function in the terminal to being process of inputting info for  the team roster.
createManager();