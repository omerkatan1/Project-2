DROP DATABASE IF EXISTS sqwash;
CREATE DATABASE sqwash;

USE sqwash;


CREATE TABLE startups (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE developers (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    info VARCHAR(300) NOT NULL,
    available BOOLEAN default 1,
    PRIMARY KEY (id)
);

CREATE TABLE projects (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    dev_id INT,
    FOREIGN KEY (dev_id) REFERENCES developers (id),
    startup_id INT,
    FOREIGN KEY (startup_id) REFERENCES startups (id), 
    PRIMARY KEY (id)
);

CREATE TABLE applicants (
    id INT NOT NULL AUTO_INCREMENT,
    dev_id INT,
    FOREIGN KEY (dev_id) REFERENCES developers (id),
    proj_id INT,
    FOREIGN KEY (proj_id) REFERENCES projects (id),
    PRIMARY KEY (id)
);
