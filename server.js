const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    database: "employee_db",
  },
  console.log("Connected to Database.")
);
//Gets all the latest departments into an array
function latestAllDepartmentsArray() {
  const departments = new Promise((resolve, reject) => {
    db.query("SELECT * FROM department", async function (err, results) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(results);
    });
  });
  return departments;
}
//Gets all the latest roles into an array
function latestAllRolesArray() {
  const roles = new Promise((resolve, reject) => {
    db.query("SELECT title FROM role", async function (err, results) {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(results);
      const rolesList = results.map(({ title: value }) => value);
      resolve(rolesList);
    });
  });
  return roles;
}
//Gets all the latest employees into an array
function latestAllEmployeesArray() {
  const employees = new Promise((resolve, reject) => {
    db.query(
      "SELECT first_name, last_name FROM employee",
      async function (err, results) {
        if (err) {
          console.log(err);
          reject(err);
        }
        const employeeList = results.map(
          ({ first_name: value1, last_name: value2 }) => `${value1} ${value2}`
        );
        resolve(employeeList);
      }
    );
  });
  return employees;
}
//Gets the department ID
function getDepartmentID(department) {
  const departmentID = new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM department WHERE name = '${department}'`,
      async function (err, results) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(results[0].id);
      }
    );
  });
  return departmentID;
}
//Gets the role ID
function getRoleID(role) {
  const roleID = new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM role WHERE title = '${role}'`,
      async function (err, results) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(results[0].id);
      }
    );
  });
  return roleID;
}
//Shows the menu opening up options in Inquirer
function displayMenu() {
  inquirer
    .prompt({
      type: "list",
      message: "Please select an action below",
      name: "menuChoice",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
      ],
    })
    .then((data) => {
      if (data.menuChoice === "view all departments") {
        viewAllDepartments();
      }
      if (data.menuChoice === "view all roles") {
        viewAllRoles();
      }
      if (data.menuChoice === "view all employees") {
        viewAllEmployees();
      }
      if (data.menuChoice === "add a department") {
        addDepartment();
      }
      if (data.menuChoice === "add a role") {
        addRole();
      }
      if (data.menuChoice === "add an employee") {
        addEmployee();
      }
      if (data.menuChoice === "update an employee role") {
        updateEmployeeRole();
      }
    });
}
//Displays all the departments
function viewAllDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    console.table(results);
    displayMenu();
  });
}
//Displays all the roles
function viewAllRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    console.table(results);
    displayMenu();
  });
}
//Displays all employees
function viewAllEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    console.table(results);
    displayMenu();
  });
}
//Adds a department to the table
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "newDepartment",
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO department (name) VALUES ("${data.newDepartment}")`,
        function (err, results) {
          if (err) {
            console.log(err);
            return;
          }
          viewAllDepartments();
        }
      );
    });
}
//Adds a role to the function
async function addRole() {
  const departments = await latestAllDepartmentsArray();
  inquirer
    .prompt([
      {
        type: "input",
        message: "What role do you want to add?",
        name: "newRole",
      },
      {
        type: "input",
        message: "What is the salary?",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department does it belong to?",
        name: "departmentName",
        choices: departments,
      },
    ])
    .then(async (data) => {
      const departmentOfRole = data.departmentName;
      const departmentID = await getDepartmentID(departmentOfRole);
      db.query(
        `INSERT INTO role (title,salary,department_id) VALUES ('${data.newRole}','${data.roleSalary}','${departmentID}')`,
        function (err, results) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`${data.newRole} added.`);
          displayMenu();
        }
      );
    });
}
//Adds an employee to the table
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: `What is the employee's first name?`,
        name: "firstName",
      },
      {
        type: "input",
        message: `What is the employee's last name?`,
        name: "lastName",
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO employee (first_name,last_name) VALUES ('${data.firstName}','${data.lastName}')`,
        function (err, results) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(
            `${data.firstName} ${data.lastName} added as an employee.`
          );
          displayMenu();
        }
      );
    });
}
//updates an employee role
async function updateEmployeeRole() {
  const employees = await latestAllEmployeesArray();
  const roles = await latestAllRolesArray();
  console.log(roles);
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        name: "employee",
        choices: employees,
      },
      {
        type: "list",
        message: "Which role do you want them to have?",
        name: "role",
        choices: roles,
      },
    ])
    .then(async (data) => {
      const roleOfEmployee = data.role;
      const roleID = await getRoleID(roleOfEmployee);
      const employee = data.employee;
      const employeeID = employees.indexOf(employee) + 1;
      db.query(
        `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
        function (err, results) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`${data.role} added to ${data.employee}.`);
          displayMenu();
        }
      );
    });
}

displayMenu();
