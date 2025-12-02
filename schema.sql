-- Blood Donation Management System Database Schema
-- PostgreSQL version for Supabase
-- Using SERIAL for PostgreSQL auto-incrementing IDs

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS Delivers CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Stored_To CASCADE;
DROP TABLE IF EXISTS Blood CASCADE;
DROP TABLE IF EXISTS Recipient CASCADE;
DROP TABLE IF EXISTS Donor CASCADE;
DROP TABLE IF EXISTS Hospital CASCADE;
DROP TABLE IF EXISTS BloodBank CASCADE;
DROP TABLE IF EXISTS Hospital_Inventory CASCADE;

CREATE TABLE BloodBank (
    BloodBank_ID SERIAL PRIMARY KEY,
    BloodBank_name VARCHAR(100) NOT NULL,
    Location VARCHAR(100),
    Phone_Number VARCHAR(15)
);

CREATE TABLE Hospital (
    Hospital_ID SERIAL PRIMARY KEY,
    Hospital_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100),
    Phone_Number VARCHAR(15)
);

CREATE TABLE Donor (
    Donor_ID SERIAL PRIMARY KEY,
    f_name VARCHAR(50),
    m_initial CHAR(1),
    l_name VARCHAR(50),
    Date_Of_Birth DATE,
    Phone_Number VARCHAR(15),
    Last_Day_Of_Donation DATE,
    Gender CHAR(1),
    BB_ID INTEGER,
    FOREIGN KEY (BB_ID) REFERENCES BloodBank(BloodBank_ID)
);

CREATE TABLE Blood (
    Blood_ID SERIAL PRIMARY KEY,
    Blood_Type VARCHAR(3),
    Expiration_Date DATE,
    Quantity_Donated DECIMAL(5,2),
    Donor_ID INTEGER,
    FOREIGN KEY (Donor_ID) REFERENCES Donor(Donor_ID)
);

CREATE TABLE Recipient (
    Recipient_ID SERIAL PRIMARY KEY,
    f_name VARCHAR(50),
    m_initial CHAR(1),
    l_name VARCHAR(50),
    Date_Of_Birth DATE,
    Gender CHAR(1),
    Blood_Type VARCHAR(3),
    Phone_Number VARCHAR(15)
);

CREATE TABLE Hospital_Inventory (
    blood_id INTEGER,
    Hospital_ID INTEGER,
    PRIMARY KEY (blood_id, Hospital_ID),
    FOREIGN KEY (blood_id) REFERENCES blood(blood_id),
    FOREIGN KEY (Hospital_ID) REFERENCES Hospital(Hospital_ID)
);

CREATE TABLE Stored_To (
    Blood_ID INTEGER,
    BloodBank_ID INTEGER,
    PRIMARY KEY (Blood_ID, BloodBank_ID),
    FOREIGN KEY (Blood_ID) REFERENCES Blood(Blood_ID),
    FOREIGN KEY (BloodBank_ID) REFERENCES BloodBank(BloodBank_ID)
);

CREATE TABLE Orders (
    BloodBank_ID INTEGER,
    Hospital_ID INTEGER,
    PRIMARY KEY (BloodBank_ID, Hospital_ID),
    FOREIGN KEY (BloodBank_ID) REFERENCES BloodBank(BloodBank_ID),
    FOREIGN KEY (Hospital_ID) REFERENCES Hospital(Hospital_ID)
);

CREATE TABLE Delivers (
    Hospital_ID INTEGER,
    Recipient_ID INTEGER,
    PRIMARY KEY (Hospital_ID, Recipient_ID),
    FOREIGN KEY (Hospital_ID) REFERENCES Hospital(Hospital_ID),
    FOREIGN KEY (Recipient_ID) REFERENCES Recipient(Recipient_ID)
);
