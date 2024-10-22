SELECT employee_role.id, title, department_name AS department, salary FROM employee_role JOIN department ON employee_role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, department.department_name AS department, salary, CONCAT(employee.first_name, ' ', employee.last_name) AS manager 
FROM employee JOIN employee_role ON employee.role_id = employee_role.id RIGHT JOIN department ON employee_role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

SELECT CONCAT(first_name, ' ', last_name) AS employee 
FROM employee 
WHERE manager_id IS NULL;

SELECT CONCAT (first_name, ' ', last_name) AS employee FROM employee WHERE manager_id IS NULL;