import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js'

await connectToDb();

const startInquire = function() {
    inquirer.prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: [
            'Add a new department',
            'Add a new role',
            'Add a new employee',
            'View all departments',
            'View all roles',
            'View all employees',
            'Update an employee role',
            'Exit'
        ]
    }
])
.then(async (answers) => {
    switch (answers.action) {
        case 'Add a new department':
            
            break;
        case 'Add a new role':
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What role would you like to add?',
                    name: 'addRole',
                }
            ]).then(async (answers) => {
                const role = answers.addRole;
                const query = `INSERT INTO employee_role (title) VALUES ('${role}')`;
                await pool.query(query);
                console.log(`Added ${role} to roles`);
            })
            break;
        case 'Add a new employee':
            break;
        case 'View all departments':
            break;
        case 'View all roles':
            break;
        case 'View all employees':
            break;
        case 'Update an employee role':
            break;
        case 'Exit':
            break;
        default:
    }
})}