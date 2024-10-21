INSERT INTO department (department_name) VALUES
('Sales'),
('Engineering'),
('HR');

-- Seed data for Employee Roles
INSERT INTO employee_role (title, salary, department_id) VALUES
-- Sales Department Roles
('Sales Manager', 90000, 1),
('Senior Sales Executive', 75000, 1),
('Sales Executive', 60000, 1),
-- Engineering Department Roles
('Engineering Manager', 110000, 2),
('Senior Engineer', 95000, 2),
('Engineer', 80000, 2),
-- HR Department Roles
('HR Manager', 85000, 3),
('Senior HR Specialist', 70000, 3),
('HR Specialist', 55000, 3);

-- Seed data for Employees (Managers first, followed by other employees)

-- Sales Department Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Smith', 1, NULL),  -- Sales Manager
('Michael', 'Brown', 2, 1),  -- Senior Sales Executive
('Laura', 'Wilson', 2, 1),   -- Senior Sales Executive
('James', 'Johnson', 3, 1),  -- Sales Executive
('Emily', 'Davis', 3, 1);    -- Sales Executive

-- Engineering Department Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Green', 4, NULL),  -- Engineering Manager
('David', 'White', 5, 6),     -- Senior Engineer
('Chris', 'Taylor', 5, 6),    -- Senior Engineer
('Sophia', 'Anderson', 6, 6), -- Engineer
('Daniel', 'Thomas', 6, 6);   -- Engineer

-- HR Department Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Mary', 'Brown', 7, NULL),  -- HR Manager
('Karen', 'Martinez', 8, 11),  -- Senior HR Specialist
('Nancy', 'Lopez', 8, 11),     -- Senior HR Specialist
('Robert', 'Harris', 9, 11),   -- HR Specialist
('Jessica', 'Clark', 9, 11);   -- HR Specialist
