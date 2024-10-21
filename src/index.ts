import inquirer from "inquirer";
import { QueryResult } from "pg";
import { pool, connectToDb } from "./connection.js";
import employee from "./classes/employee.js";
import Role from "./classes/employee_role.js";

await connectToDb();

class Department {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Cli {
  async viewDepartments() {
    const { rows } = await pool.query("SELECT * FROM department");
    console.table(rows);
    this.perfomActions();
  };

  async viewRoles() {
    const { rows } = await pool.query( `SELECT employee_role.id, title, department_name AS department, salary FROM employee_role JOIN department ON employee_role.department_id = department.id;`);
    console.table(rows);
    this.perfomActions();
  };

  async viewEmployees() {
    const { rows } = await pool.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN employee_role ON employee.role_id = employee_role.id JOIN department ON employee_role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`);
    console.table(rows);
    this.perfomActions();
  };

  async addDepartment() {
    inquirer.prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then(async(answer) => {
      const newDepartment = new Department(
        answer.department
      );
      await pool.query(
        "INSERT INTO department (id, department_name) VALUES ($1)",
        [newDepartment.name]
      );
      console.log("Department added!");
      this.perfomActions();
    });
  };

  async addRole() {
    inquirer.prompt([
      {
        type: "list",
        name: "createdRole",
        message: "What department is the new role in?",
        choices: ["Sales", "Engineering", "HR"],
      },
      {
        type: "input",
        name: "salary",
        message: "What will they be paid?",
      },
    ])
    .then(async(response) => {
      const departmentId = function (): number | null {
        switch (response.createdRole) {
          case "Sales":
            return 1;
          case "Engineering":
            return 2;
          case "HR":
            return 3;
          default:
            return null;
        }
      };
      const newRole = new Role(
        response.createdRole,
        response.salary,
        departmentId()
      );
      await pool.query("INSERT INTO role (id, title) VALUES ($1, $2)", [
        newRole.title,
        newRole.salary,
        newRole.department_id,
      ]);
      console.log("Role added!");
      this.perfomActions();
    });
  };

  async addEmployee() {
    inquirer.prompt([
      {

      }
    ])
  }

  perfomActions() {
    inquirer.prompt([
      {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then(async(choice) => {
      
    });
  }
}
// function startApp() {
//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "actions",
//         message: "What would you like to do?",
//         choices: [
//           "View all departments",
//           "View all roles",
//           "View all employees",
//           "Add a department",
//           "Add a role",
//           "Add an employee",
//           "update an employee role",
//         ],
//       },
//     ])
//     .then((selection) => {
//       if (selection.actions === "View all departments") {
//         pool.query(
//           "SELECT * FROM department",
//           (err: Error, result: QueryResult) => {
//             if (err) {
//               console.error(err);
//               return;
//             }
//             console.table(result.rows);
//           }
//         );
//         startApp();
//       } else if (selection.actions === "Add a department") {
//         inquirer
//           .prompt([
//             {
//               type: "input",
//               name: "department",
//               message:
//                 "What is the name of the department you would like to add?",
//             },
//           ])
//           .then(async (answer) => {
//             const { rows } = await pool.query("SELECT * FROM department");
//             const departments = rows;
//             console.table(departments);
//             const newDepartment = new Department(
//               departments.length + 1,
//               answer.department
//             );
//             await pool.query(
//               "INSERT INTO department (id, name) VALUES ($1, $2)",
//               [newDepartment.id, newDepartment.name]
//             );
//             console.log("Department added!");
//             startApp();
//           });
//       } else if (selection.actions === "View all roles") {
//         pool.query(
//           "SELECT employee_role.id, title, department_name AS department, salary FROM employee_role JOIN department ON employee_role.department_id = department.id;",
//           (err: Error, result: QueryResult) => {
//             if (err) {
//               console.error(err);
//               return;
//             }
//             const { rows } = result;
//             console.table(rows);
//           }
//         );
//         startApp();
//       } else if (selection.actions === "Add a role") {
//         inquirer
//           .prompt([
//             {
//               type: "input",
//               name: "newRole",
//               message: "What is the name of the role you would like to add?",
//             },
//             {
//               type: "input",
//               name: "salary",
//               message: "What will they be paid?",
//             },
//             {
//               type: "list",
//               name: "department",
//               message: "Which department does this role belong to?",
//               choices: ["Sales", "Engineering", "HR"],
//             },
//           ])
//           .then(async (response) => {
//             const departmentId = function (): number | null {
//               switch (response.department) {
//                 case "Sales":
//                   return 1;
//                 case "Engineering":
//                   return 2;
//                 case "HR":
//                   return 3;
//                 default:
//                   return null;
//               }
//             };
//             const { rows } = await pool.query("SELECT id FROM role");
//             const roles = rows;
//             const newRole = new Role(
//               roles.length + 1,
//               response.newRole,
//               response.salary,
//               departmentId()
//             );
//             await pool.query("INSERT INTO role (id, title) VALUES ($1, $2)", [
//               newRole.id,
//               newRole.title,
//             ]);
//             console.log("Role added!");
//             startApp();
//           });
//       } else if (selection.actions === "View all employees") {
//         const sql = `SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN employee_role ON employee.role_id = employee_role.id JOIN department ON employee_role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
//         pool.query(sql, (err: Error, result: QueryResult) => {
//           if (err) {
//             console.error(err);
//             return;
//           }
//           const { rows } = result;
//           console.table(rows);
//         });
//       }
//     });
// }

// startApp();
