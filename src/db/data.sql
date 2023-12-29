CREATE DATABASE skatepark;

CREATE TABLE skaters (
    id SERIAL, 
    email VARCHAR(255) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    experience VARCHAR(255) NOT NULL, 
    skill VARCHAR(255) NOT NULL, 
    photo VARCHAR(255) NOT NULL, 
    validate BOOLEAN NOT NULL
);
