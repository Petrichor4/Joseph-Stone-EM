import inquirer from "inquirer";
import { QueryResult } from "pg";
import { pool, connectToDb } from "./connection.js";
import employee from "./classes/employee.js";
import Role from "./classes/employee_role.js";

class Department {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

await connectToDb();

function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
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
    .then((selection) => {
      switch (selection.actions) {
        case "View all deparements":
          pool.query(
            "SELECT * FROM department",
            (err: Error, result: QueryResult) => {
              if (err) {
                console.error(err);
                return;
              }
              const { rows } = result;
              console.table(rows);
            }
          );
          startApp();
          break;
        case "Add a department":
          inquirer
            .prompt([
              {
                type: "input",
                name: "department",
                message:
                  "What is the name of the department you would like to add?",
              },
            ])
            .then(async (answer) => {
              const { rows } = await pool.query("SELECT * FROM department");
              const departments = rows;
              console.table(departments);
              const newDepartment = new Department(
                departments.length + 1,
                answer.department
              );
              await pool.query(
                "INSERT INTO department (id, name) VALUES ($1, $2)",
                [newDepartment.id, newDepartment.name]
              );
              console.log("Department added!");
              startApp();
            });
          break;
        case "View all roles":
          pool.query(
            "SELECT employee_role.id, title, department_name AS department, salary FROM employee_role JOIN department ON employee_role.department_id = department.id;",
            (err: Error, result: QueryResult) => {
              if (err) {
                console.error(err);
                return;
              }
              const { rows } = result;
              console.table(rows);
            }
          );
          startApp();
          break;
        case "Add a role":
          inquirer
            .prompt([
              {
                type: "input",
                name: "newRole",
                message: "What is the name of the role you would like to add?",
              },
              {
                type: "input",
                name: "salary",
                message: "What will they be paid?",
              },
              {
                type: "list",
                name: "department",
                message: "Which department does this role belong to?",
                choices: ["Sales", "Engineering", "HR"],
              },
            ])
            .then(async (response) => {
              const departmentId = function (): number | null {
                switch (response.department) {
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
              const { rows } = await pool.query("SELECT id FROM role");
              const roles = rows;
              const newRole = new Role(
                roles.length + 1,
                response.newRole,
                response.salary,
                departmentId()
              );
              await pool.query("INSERT INTO role (id, title) VALUES ($1, $2)", [
                newRole.id,
                newRole.title,
              ]);
              console.log("Role added!");
              startApp();
            });
          break;
        case "View all employees":
          const sql = `SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN employee_role ON employee.role_id = employee_role.id JOIN department ON employee_role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
          pool.query(sql, (err: Error, result: QueryResult) => {
            if (err) {
              console.error(err);
              return;
            }
            const { rows } = result;
            console.table(rows);
          });
      }
    });
}

startApp();
