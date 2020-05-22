const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const mysql = require("mysql");
const cTable = require('console.table');
let message = "";
let divider = "=";
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306, // Your port; if not 3306
    user: "root", // Your username
    password: "1636Shadowsonny", // Your password
    database: "companydb"
});

function headingMsg() {
    console.clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Employee Manager\n' + message, { horizontalLayout: 'default' })
        )
    );
};

function init() {
    console.clear()
    console.log(
        chalk.bold.blueBright(
            figlet.textSync('Employee Manager', {horizontalLayout: 'fitted' })
        )
    );
    //afterConnection();
    start();// function to start the menu and general program
}

function viewAllEmp() {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log(
            chalk.yellow(
                figlet.textSync(message, { horizontalLayout: 'fitted' })
            )
        );
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

};

function empDept(message) {
    let query = "SELECT department.name, employee.id, employee.first_name, employee.last_name, role.title FROM `employee`, `department`, `role` WHERE role.`department_id`= department.`id` AND employee.role_id=role.id;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log(
            chalk.yellow(
                figlet.textSync(message, { horizontalLayout: 'fitted' })
            )
        );
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

}

function empMan(message) {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ORDER BY manager;"
    query+=
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log(
            chalk.yellow(
                figlet.textSync(message, { horizontalLayout: 'fitted' })
            )
        );
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

}

function addRole(message, role, salary, department_id) {
        // based on their answer
        console.log("Inserting a new Role...\n");
        console.log("addRole: ", role);
        console.log("addSalary: ", salary);
        console.log("addDepartment_id: ", department_id);
        
        let query = connection.query(
        "INSERT INTO role SET ?",
        {
            title: role,
            salary: salary,
            department_id: department_id
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " new Role inserted!\n");
            // Call updateProduct AFTER the INSERT completes
            start();
        }
        );
    
        // logs the actual query being run
        console.log(query.sql);
}

function addDept(message, name) {
    // based on their answer
    console.log("Creating a new Department...\n");
    console.log("Department name: ", name);
    
    let query = connection.query(
    "INSERT INTO department SET ?",
    {
        name: name
    },
    function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " new Department created!\n");
        // Call updateProduct AFTER the INSERT completes
        start();
    }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function viewDept(message) {
    let query = "SELECT department.id AS Id, department.name AS Department FROM department;";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log(
            chalk.yellow(
                figlet.textSync(message, { horizontalLayout: 'fitted' })
            )
        );
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

};

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do? \n Choose 'Exit' to close the program.\n",
                choices: [
                    "======================================",
                    "View ALL Employees",
                    "View ALL Employees by Department",
                    "View ALL Employees by Manager",
                    "======================================",
                    "ADD an Employee",
                    "REMOVE an Employee",
                    "UPDATE Employee Role",
                    "Update Employee Manager",
                    "Update Employee Department",
                    "======================================",
                    "View all Roles",
                    "Add a Role",
                    "Remove a Role",
                    "======================================",
                    "View all Managers",
                    "Add Manager",
                    "Remove a Manager",
                    "======================================",
                    "View all Departments",
                    "Add a Department",
                    "Remove a Department",
                    "======================================",
                    "Exit"
                ],
                name: "start",
            },
            {
                type: "input",
                message: "What is the name of the new Role?",
                name: "role",
                when: (start) => start.start === "Add a Role",
                validate: async (input) => {
                    if (await input.trim().length === 0) {
                        return "NOT a valid entry! Please try again.";
                    } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                        return true;
                    } else {
                        return "Not a valid entry!"
                    }
                }
            },
            {
                type: "number",
                message: "What is the Salary for that Role(Numbers only)?",
                name: "salary",
                when: (start) => start.start === "Add a Role",
            },
            {
                type: "number",
                message: "What is the Department ID of the new Role?\n(Remember you must have a Department to assign a role.)",
                name: "department_id",
                when: (start) => start.start === "Add a Role",
            },
            {
                type: "input",
                message: "What is the name of the new Department?",
                name: "name",
                when: (start) => start.start === "Add a Department",
                validate: async (input) => {
                    if (await input.trim().length === 0) {
                        return "NOT a valid entry! Please try again.";
                    } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                        return true;
                    } else {
                        return "Not a valid entry!"
                    }
                }
            },
        ])
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            console.log("\n",answer);
            message = answer.start;
            switch (answer.start) {
                case "======================================":
                    console.clear();
                    start(message);
                    break;

                case "View ALL Employees":
                    viewAllEmp(message);
                    break;

                case "View ALL Employees by Department":
                    empDept(message);
                    break;

                case "View ALL Employees by Manager":
                    empMan(message);
                    break;

                case "ADD an Employee":
                    songSearch();
                    break;

                case "REMOVE an Employee":
                    artistSearch();
                    break;

                case "UPDATE Employee Role":
                    multiSearch();
                    break;

                case "Update Employee Manager":
                    rangeSearch();
                    break;

                case "Update Employee Department":
                    songSearch();
                    break;

                case "View all Roles":
                    getRole(message);
                    break;

                case "Add a Role":
                    addRole(message, answer.role, answer.salary, answer.department_id);
                    break;

                case "Remove a Role":
                    removeRole(message, answer.role, answer.salary, answer.department_id); //Will only need the role primary id but just simplier to copy/paste ATM
                    break;

                case "View all Managers":
                    multiSearch();
                    break;

                case "Add Manager":
                    rangeSearch();
                    break;

                case "Remove a Manager":
                    songSearch();
                    break;

                case "View all Departments":
                    viewDept(message);
                    break;

                case "Add a Department":
                    addDept(message, answer.name);
                    break;

                case "Remove a Department":
                    songSearch();
                    break;

                case "Exit":
                    connection.end();
                    break;
                    console.log(
                        chalk.yellow(
                            figlet.textSync('\nTHANK YOU for using \nEmployee Manager!\n', { horizontalLayout: 'full' })
                        )
                    );
            }
        })    
        .catch(error => {
            if(error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            } else {
            console.log(error);
            }
        })
    
};


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // start();
});

function afterConnection() { //test function to get intial employee list from db
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        //connection.end();
    });
}

let role = [];
function getRole(message) {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log(
            chalk.yellow(
                figlet.textSync(message, { horizontalLayout: 'fitted' })
            )
        );
        console.log(divider.repeat(120));
        console.table(res);
        start();
    })
};

let startQues =
    [
        {
            type: "list",
            message: "What would you like to do? \n Choose 'Exit' to close the program.\n",
            choices: [
                "View ALL Employees",
                "View ALL Employees by DEPARTMENT",
                "View ALL Employees by Manager",
                "ADD an Employee",
                "REMOVE an employee",
                "UPDATE Employee Role",
                "Update Employee Manager",
                "Update Employee Department",
                "View all Roles",
                "Add a Role",
                "Remove a Role",
                "View all Managers",
                "Add Manager",
                "Remove a Manager",
                "Exit"
            ],
            name: "start",
        },
        {
            type: "input",
            message: "What is the Employee's first name?",
            name: "name",
            when: (employeeQues) => employeeQues.role !== "Exit",
            validate: async (input) => {
                if (await input.trim().length === 0) {
                    return "NOT a valid entry! Please try again.";
                } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                    return true;
                } else {
                    return "Not a valid entry!"
                }
            }
        },
        {
            type: "input",
            message: "What is the Salary for that Role(Numbers only)?",
            name: "id",
            when: (employeeQues) => employeeQues.role !== "Exit",
            validate: async (input) => {
                if (input.match(/^[0-9]+$/i)) {
                    return true;
                } else {
                    return "Not valid. Enter ID number."
                }
            }
        },
        {
            type: "list",
            message: "What is the Employee's manager",
            name: "employeeManager",
            choices: [
                "View ALL Employees",
                "View ALL Employees by DEPARTMENT",
                "View ALL Employees by Manager",
                "ADD an Employee",
                "REMOVE an employee",
                "UPDATE Employee Role",
                "Update Employee Manager",
                "Update Employee Department",
                "View all Roles",
                "Add a Role",
                "Remove a Role",
                "View all Managers",
                "Add Manager",
                "Remove a Manager",
                "Exit"
            ],
            name: "start",
            when: (employeeQues) => employeeQues.role !== "Exit",
            validate: async (input) => {
                if (input.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i)) {
                    return true;
                } else {
                    return "Not a valid email address."
                }
            }
        }
    ];

const newEmployee = async () => {
    try {
        console.log("New Employee Questions");
        const input = await inquirer
            .prompt([
                /* Pass your questions in here */
                {
                    type: "input",
                    message: "What is the Employee's first name?",
                    name: "first_name",
                    when: (start) => start.start === "ADD an Employee",
                    validate: async (input) => {
                        if (await input.trim().length === 0) {
                            return "NOT a valid entry! Please try again.";
                        } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                            return true;
                        } else {
                            return "Not a valid entry!"
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is the Employee's last name?",
                    name: "last_name",
                    when: (start) => start.start === "ADD an Employee",
                    validate: async (input) => {
                        if (await input.trim().length === 0) {
                            return "NOT a valid entry! Please try again.";
                        } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                            return true;
                        } else {
                            return "Not a valid entry!"
                        }
                    }
                },
                {
                    type: "list",
                    message: "What is the Employee's Department?",
                    name: "empdept",
                    when: (start) => start.start === "ADD an Employee",
                    validate: async (input) => {
                        if (await input.trim().length === 0) {
                            return "NOT a valid entry! Please try again.";
                        } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                            return true;
                        } else {
                            return "Not a valid entry!"
                        }
                    }
                },
                {
                    type: "list",
                    message: "What is the Employee's role?",
                    name: "first_name",
                    when: (start) => start.start === "ADD an Employee",
                    validate: async (input) => {
                        if (await input.trim().length === 0) {
                            return "NOT a valid entry! Please try again.";
                        } else if (input.match(/^[a-zA-Z]+( [a-zA-Z]+)*$/i)) {
                            return true;
                        } else {
                            return "Not a valid entry!"
                        }
                    }
                },
            ])
            .then(answers => {
                // Use user feedback for... whatever!!
            })
            .catch(error => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    // Something else when wrong
                }
            });
    } catch (err) {
        console.log(err)
    }
}

init();