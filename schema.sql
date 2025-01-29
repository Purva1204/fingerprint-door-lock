CREATE DATABASE fingerprint_auth;

USE fingerprint_auth;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(15) NOT NULL UNIQUE,
    hashedFingerprint TEXT NOT NULL
);