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

function displayMenu() {
  //Presents the options through inquirer
  inquirer
    .prompt([
      {
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
      },
    ])
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
      if (data.menuChoice === "add a roll") {
        console.log("not ready");
      }
      if (data.menuChoice === "add an employee") {
        console.log("not ready");
      }
      if (data.menuChoice === "update an employee role") {
        console.log("not ready");
      }
    });
}
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
//init function calls selection function. Thats where the inquirer options begin. It will create the prompt lists. If prompt answer
// === option run the db.query function. console.table shows the results in table format. would need to install with npm i
// Need selection functions (display all, selection, etc)
// Need adding functions (new department, employee, etc)
