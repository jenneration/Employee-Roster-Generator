const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { create } = require("domain");

const teamMembers = [];

console.log("Running"); //test



function createManager() {
    console.log("Hello company manager! Let's build your team roster."); // Add second line on a time interval and directly address the manager
    inquirer.prompt([{
            type: "input",
            message: "Please enter your name:",
            name: "name"
        },
        {
            type: "input",
            message: "Enter your i.d. number:",
            name: "id",
        },
        {
            type: "input",
            message: "Enter your email:",
            name: "email",
        },
        {
            type: "input",
            message: "What is your office number?",
            name: "officeNumber"
        }
    ]).then(function(answers) {
        const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        teamMembers.push(manager);
        console.log(teamMembers); //test
        createTeamMembers();
    });
};

function createTeamMembers() {
    inquirer.prompt([{
        type: "list",
        message: "Which team member will you add to your team roster?",
        choices: ["Engineer", "Intern", "Neither, I'm done."],
        name: "team"
    }]).then(function(answers) {
        switch (answers.team) {
            case "Engineer":
                createEngineer()
                break;
            case "Intern":
                createIntern()
                break;
            case "Neither, I'm done.":
                renderTeamRoster()
                break;
            default:
                renderTeamRoster();
        }
    });
};

function createEngineer() {
    console.log("Please enter information about this engineer.");
    inquirer.prompt([{
            type: "input",
            message: "What is the engineer's name?",
            name: "name"
        },
        {
            type: "input",
            message: "Enter engineer i.d. number:",
            name: "id",
        },
        {
            type: "input",
            message: "Enter engineer email:",
            name: "email"
        },
        {
            type: "input",
            message: "Enter engineer's GitHub username:",
            name: "github"
        }
    ]).then(function(answers) {
        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
        teamMembers.push(engineer);
        console.log(teamMembers); //test
        createTeamMembers();
    });
};

function createIntern() {
    console.log("Please enter information about this intern.")
    inquirer.prompt([{
            type: "input",
            message: "What is the intern's name?",
            name: "name"
        },
        {
            type: "input",
            message: "Enter intern i.d. number:",
            name: "id",
        },
        {
            type: "input",
            message: "Enter intern email:",
            name: "email"
        },
        {
            type: "input",
            message: "Enter intern's school name:",
            name: "school"
        }
    ]).then(function(answers) {
        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        teamMembers.push(intern);
        console.log(teamMembers); //test
        createTeamMembers();
    });
};

function renderTeamRoster() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, render(teamMembers), function(err) {
        if (err) throw err;
        console.log("Employee Roster Generated!");
    });
};


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

createManager();