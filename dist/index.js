import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";
import employee from "./classes/employee.js";
import Role from "./classes/employee_role.js";
await connectToDb();
class Department {
    constructor(name) {
        this.name = name;
    }
}
class Cli {
    async getDepartments() {
        try {
            const result = await pool.query(`SELECT ARRAY(SELECT department_name FROM department)`);
            return result.rows[0]?.array || [];
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getManagers() {
        try {
            const result = await pool.query(`SELECT ARRAY(SELECT CONCAT(first_name, ' ', last_name)) FROM employee WHERE manager_id IS NULL`);
            return result.rows[0]?.array || [];
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getroles() {
        try {
            const result = await pool.query(`SELECT ARRAY(SELECT title FROM employee_role)`);
            console.log(result.rows);
            console.log(result.rows[0]?.array);
            return result.rows[0]?.array || [];
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getEmployees() {
        try {
            const result = await pool.query(`SELECT ARRAY(SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee)`);
            return result.rows[0]?.array || [];
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async viewDepartments() {
        const { rows } = await pool.query("SELECT * FROM department");
        console.table(rows);
        this.startApp();
    }
    async viewRoles() {
        const { rows } = await pool.query(`SELECT employee_role.id, title, department_name AS department, salary FROM employee_role JOIN department ON employee_role.department_id = department.id;`);
        console.table(rows);
        this.startApp();
    }
    async viewEmployees() {
        const { rows } = await pool.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      JOIN employee_role ON employee.role_id = employee_role.id 
      JOIN department ON employee_role.department_id = department.id 
      LEFT JOIN employee manager ON employee.manager_id = manager.id;
`);
        console.log(rows.length);
        console.table(rows);
        this.startApp();
    }
    async addDepartment() {
        inquirer
            .prompt([
            {
                type: "input",
                name: "department",
                message: "What is the name of the department you would like to add?",
            },
        ])
            .then(async (answer) => {
            const newDepartment = new Department(answer.department);
            try {
                await pool.query("INSERT INTO department (department_name) VALUES ($1)", [newDepartment.name]);
            }
            catch (err) {
                console.error(err);
            }
            console.log(`Department:${newDepartment.name} added!`);
            this.startApp();
        });
    }
    async addRole() {
        const departments = await this.getDepartments();
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
                message: "What department is the new role in?",
                choices: departments,
            },
        ])
            .then(async (response) => {
            const departmentId = async function () {
                try {
                    const result = await pool.query("SELECT id FROM department WHERE department_name = $1", [response.department]);
                    return result.rows[0]?.id || null;
                }
                catch (err) {
                    console.error(err);
                    return null;
                }
            };
            const newRole = new Role(response.newRole, response.salary, await departmentId());
            await pool.query("INSERT INTO employee_role (title, salary, department_id) VALUES ($1, $2, $3)", [newRole.title, newRole.salary, newRole.department_id]);
            console.log(`Role:${newRole.title} added!`);
            this.startApp();
        });
    }
    async addEmployee() {
        const managers = await this.getManagers();
        const roles = await this.getroles();
        inquirer
            .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: managers,
            },
        ])
            .then(async (response) => {
            const roleId = async function () {
                try {
                    const result = await pool.query("SELECT id FROM employee_role WHERE title = $1", [response.role]);
                    return result.rows[0]?.id || null;
                }
                catch (err) {
                    console.error(err);
                    return null;
                }
            };
            const managerId = async function () {
                try {
                    const result = await pool.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) = $1`, [response.manager]);
                    return result.rows[0]?.id;
                }
                catch (err) {
                    console.error(err);
                    return null;
                }
            };
            const newEmployee = new employee(response.firstName, response.lastName, await roleId(), await managerId());
            try {
                await pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [
                    newEmployee.first_name,
                    newEmployee.last_name,
                    newEmployee.role_id,
                    newEmployee.manager_id,
                ]);
                console.log(`${newEmployee.first_name}${newEmployee.last_name} was added to the database!`);
            }
            catch (err) {
                console.error(err);
            }
            this.startApp();
        });
    }
    async updateEmployeeRole() {
        const employees = await this.getEmployees();
        const roles = await this.getroles();
        inquirer
            .prompt([
            {
                type: "list",
                message: "What employee woul you like to update?",
                choices: employees,
                name: "emName",
            },
            {
                type: "list",
                message: "Which role do you like to assign to this employee?",
                name: "updatedRole",
                choices: roles,
            },
        ])
            .then(async (response) => {
            try {
                const roleId = async function () {
                    try {
                        const result = await pool.query(`SELECT id FROM employee_role WHERE title = $1`, [response.updatedRole]);
                        return (await result.rows[0]?.id) || null;
                    }
                    catch (err) {
                        console.error(err);
                        return null;
                    }
                };
                const id = await roleId();
                pool.query(`UPDATE employee SET role_id = $1 WHERE CONCAT(first_name, ' ',last_name) = $2`, [id, response.emName]);
                console.log(`Updated ${response.emName}'s role`);
            }
            catch (err) {
                console.error(err);
            }
            this.startApp();
        });
    }
    end() {
        process.exit(0);
    }
    startApp() {
        inquirer
            .prompt([
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
                    "Quit"
                ],
            },
        ])
            .then(async (choice) => {
            if (choice.actions === "View all departments") {
                this.viewDepartments();
            }
            else if (choice.actions === "View all roles") {
                this.viewRoles();
            }
            else if (choice.actions === "View all employees") {
                this.viewEmployees();
            }
            else if (choice.actions === "Add a department") {
                this.addDepartment();
            }
            else if (choice.actions === "Add a role") {
                this.addRole();
            }
            else if (choice.actions === "Add an employee") {
                this.addEmployee();
            }
            else if (choice.actions === "Update an employee role") {
                this.updateEmployeeRole();
            }
            else if (choice.actions === "Quit") {
                this.end();
            }
        });
    }
}
const cli = new Cli();
cli.startApp();
cli.getEmployees();
