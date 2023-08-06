INSERT INTO department (id, name)
VALUES  (001, "Advertising"),
        (002, "Sales"),
        (003, "Design");

INSERT INTO role (id, title, salary, department_id)
VALUES  (001, "Advertising Manager", 55000, 001),
        (002, "Account Executive", 120000, 002),
        (003, "Lead Designer", 95000, 003);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES  (001, "John", "Smith", 001),
        (002, "Jane", "Doe", 002),
        (003, "Logan", "Staheli", 003);