INSERT INTO department (department_name) VALUES 
('HR'),
('Engineering'),
('Sales');

INSERT INTO employee_role (title, salary, department_id) VALUES 
('HR Manager', 75000, 1),
('Software Engineer', 90000, 2),
('Lead Software Engineer', 125000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Alice', 'Johnson', 1, NULL),  -- HR Manager
('Bob', 'Smith', 3, NULL),      -- Lead Software Engineer
('Charlie', 'Williams', 2, 2),  -- Software Engineer, reports to Bob
('Daisy', 'Brown', 1, 1),       -- HR Specialist, reports to Alice
('Eve', 'Miller', 2, 2);        -- Software Engineer, reports to Bob