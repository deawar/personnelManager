DROP DATABASE IF EXISTS companydb;

CREATE DATABASE companydb;
USE companydb;
CREATE TABLE department (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
  );
  
CREATE TABLE role (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT(10),
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
  );
  
CREATE TABLE employee (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER(10),
  manager_id INTEGER(10) NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);



