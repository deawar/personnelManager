
require('dotenv').config();
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const mysql = require("mysql");
const cTable = require('console.table');
const PASSWORD = process.env.PASSWORD;
const USER = process.env.USER;
var connection;
const proc = require('process');
if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306, // Your port; if not 3306
        user: USER, // Your username
        password: PASSWORD, // Your password
        database: "companydb"
    });
}
let PID = proc.pid;
let message = "";
let divider = "=";
let role = [];
let listRoleArray = [];
let listManArray = [];
let id;

function headingMsg() {
    console.clear();
    console.log(
        chalk.yellow(
            figlet.textSync(message, { horizontalLayout: 'fitted' })
        )
    );
};

function init() {
    console.clear()
    //console.log(chalk.greenBright("Server up at PID: " + chalk.blue(PID)));
    console.log(
        chalk.bold.blueBright(
            figlet.textSync('Employee Manager', { horizontalLayout: 'fitted' })
        )
    );
    //afterConnection();

    listRole(id)


}
//View All Employees
function viewAllEmp() {
    let query = "SELECT employee.id AS Id, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        headingMsg(message);
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

};

//View All Employees by Department
function empDept(message) {
    let query = "SELECT department.name AS Department, employee.id AS Id, employee.first_name AS FirstName, employee.last_name AS LastName, role.title FROM `employee`, `department`, `role` WHERE role.`department_id`= department.`id` AND employee.role_id=role.id ORDER BY department_id;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        headingMsg(message);
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

}

//View All Employees by Manager
function empMan(message) {
    let query = "SELECT employee.id AS Id, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ORDER BY manager;"
    query +=
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log("\n");
            headingMsg(message);
            console.log(divider.repeat(120));
            console.table(res);
        })
    start();

}


//ADD an Employee
function addEmployee(message, first_name, last_name, role_id, manager_id) {
    // based on their answer
    headingMsg(message);
    role_id = parseInt(role_id);
    manager_id = parseInt(manager_id);
    console.log("Manager ID: ", manager_id, role_id);
    console.log("Preparing to Add a new Employee...\n" + first_name + " " + last_name);
    // query = connection.query("SELECT * FROM employee WHERE ?;"),
    //     {
    //         first_name: first_name,
    //         last_name: last_name
    //     },
    // function (err, res) {
    //     if (err) {
    //         throw err;
    //         console.log(divider.repeat(120));
    //     } else {
    //         if (res && res.length) {
    //         console.log("Employee: " + first_name + " " + last_name + " already Present in Database.");
    //         } else {
            let query = connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: first_name,
                    last_name: last_name,
                    role_id: role_id,
                    manager_id: manager_id
                },
                function (err, res) {
                    if (err) throw err;

                    console.log(divider.repeat(120));
                    console.log(res.affectedRows + " new Employee inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                }
            );
            console.log("A New Employee:\n");
            console.log("addName: ", first_name + " " + last_name);
            console.log("\naddRoleId: ", role_id);
            console.log("\naddManager_Id: ", manager_id + "\nwas added to the Database.");

    //         }
    //     }
    // }    
    start();


    // console.log(query.sql);
};

//Add a Role
function addRole(message, title, salary, department_id) {
    // based on their answer
    console.log("Creating a new Role...\n");
    console.log("Role Title: ", title);

    let query = connection.query(
        "INSERT INTO role SET ?",
        {
            title: title,
            salary: salary,
            department_id: department_id
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " new Role created!\n");
            // Call updateProduct AFTER the INSERT completes
            start();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

//Remove a Role
function delRole(message, id) {
    // based on their answer

    let query = "SELECT role.id AS Id, role.title AS Title, role.salary AS Salary, role.department_id FROM role;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        headingMsg(message);
        console.log(divider.repeat(120));
        console.log("Res: ", res)
        inquirer.prompt([{
            type: "rawlist",
            message: "Choose the Role you wish to Delete",
            name: "id",
            choices: function () {
                const choiceArr = [];
                res.forEach(function (index) {
                    choiceArr.push(`${index.Id} ${index.Title}`)
                })
                return choiceArr;
            }
        }])
            .then(function (answer) {
                //console.log('answer', answer.id);
                let idSplit = answer.id.split(" ");
                //console.log("IdSplit: ",idSplit);
                let id = parseInt(idSplit[0]);
                connection.query(
                    "DELETE FROM role WHERE ?",
                    {
                        id: id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role deleted!\n");
                        // Call  AFTER the DELETE completes
                        console.log(divider.repeat(120));
                        console.table(res);
                        start();
                    }
                );
            })
            .catch(error => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    console.log(error);
                }
            })
    })

}

//List Roles for Choice in New Employee
function listRole(id) { // List of Roles from DB
    let query = "SELECT role.id AS Id, role.title AS Title, role.salary AS Salary, role.department_id FROM role;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.log(divider.repeat(120));
        //console.log("Res: ", res)
        for (const choice of res) {
            listRoleArray.push(`${parseInt(choice.Id)} ${choice.Title}`)
        }
        console.log('ran')
        //start();// function to start the menu and general program
        listMan(id);
    })
};

//Add a Department
function addDept(message, name) {
    // based on their answer
    console.log("Creating a new Department...\n");
    console.log("Department name: ", name);

    let query = connection.query(
        "INSERT INTO department SET ?",
        {
            name: name
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " new Department created!\n");
            // Call updateProduct AFTER the INSERT completes
            start();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

//View All Departments
function viewDept(message) {
    let query = "SELECT department.id AS Id, department.name AS Department FROM department;";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        headingMsg(message);
        console.log(divider.repeat(120));
        console.table(res);
    })
    start();

};

//Remove a Department
function delDept(message, id) {
    // based on their answer
    let idSplit = "";
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
        console.log("Res: ", res)
        inquirer.prompt([{
            type: "rawlist",
            message: "Choose the Department you wish to Delete",
            name: "id",
            choices: function () {
                const choiceArr = [];
                res.forEach(function (index) {
                    choiceArr.push(`${index.Id} ${index.Department}`)
                })
                return choiceArr;
            }
        }])
            .then(function (answer) {
                //console.log('answer', answer.id);
                idSplit = answer.id.split(" ");
                //console.log("IdSplit: ",idSplit);
                let id = parseInt(idSplit[0]);
                connection.query(
                    "DELETE FROM department WHERE ?",
                    {
                        id: id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " department deleted!\n");
                        // Call  AFTER the DELETE completes
                        console.log(divider.repeat(120));
                        console.table(res);
                    }
                );
            })
            .catch(error => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    console.log(error);
                }
            })
    })
    start();
}

//List Managers for N
function listMan(message) { // List of Roles from DB

    let query = "SELECT employee.id AS `Id`, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Title, ";
    query += "department.name AS Department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id ";
    query += "LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id IS NULL;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("listMan", message);
        if (message) {
            headingMsg(message);
            console.log("\n");
            console.log(divider.repeat(120));
            console.table(res);
        } else {
            headingMsg("Employee Manager");
        }
        console.table("top", res);
        let idSplit = JSON.stringify(res);

        let id = idSplit.Id;

        for (const choice of res) {
            listManArray.push(`${choice.Id} ${choice.FirstName} ${choice.LastName} ${choice.Title} ${choice.Department}`)
        }
        console.log("listManArr: ", listManArray);//<---------------------------Remove Please
        start();// function to start the menu and general program
    })
};

function start() {
    if (!message) {
        console.log(
            chalk.bold.blueBright(
                figlet.textSync('Employee Manager', { horizontalLayout: 'fitted' })
            )
        );
    }
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "What would you like to do? \n Choose 'Exit' to close the program.\n",
                choices: [
                    "View ALL Employees",
                    "View ALL Employees by Department",
                    "View ALL Employees by Manager",
                    "View all Managers",
                    "View all Departments",
                    "View all Roles",
                    "Add a Department",
                    "Add a Role",
                    "Add Manager",
                    "ADD an Employee",
                    "Remove a Department",
                    "Remove a Role",
                    "Remove a Manager",
                    "REMOVE an Employee",
                    "UPDATE Employee Role",
                    "Update Employee Manager",
                    "Update Employee Department",
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
                type: "rawlist",
                message: "What is the Employee's role?",
                name: "role_id",
                when: (start) => start.start === "ADD an Employee",
                choices: listRoleArray,
            },
            {
                type: "rawlist",
                message: "Who is the Employee's manager?",
                name: "manager_id",
                when: (start) => start.start === "ADD an Employee",
                choices: listManArray,
            },

        ])
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            console.log("\n", answer);
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
                    addEmployee(message, answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
                    break;

                case "REMOVE an Employee":
                    artistSearch();
                    break;

                case "UPDATE Employee Role":
                    updateRole(message);
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
                    delRole(message); //Will only need the role primary id but just simplier to copy/paste ATM
                    break;

                case "View all Managers":
                    listMan(message);
                    break;

                case "Add Manager":
                    addManager(message);
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
                    delDept(message);
                    break;

                case "Exit":
                    connection.end();
                    console.log(
                        chalk.yellow(
                            figlet.textSync('\nTHANK YOU for using \nEmployee Manager!\n', { horizontalLayout: 'full' })
                        )
                    );
                    break;
            }
        })
        .catch(error => {
            if (error.isTtyError) {
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

function getRole(message) {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        //console.log("\n");
        headingMsg(message);
        console.log(divider.repeat(120));
        console.table(res);
        start();
    })
};

init();