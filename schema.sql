--CREATE DATABASE nres;
CREATE SCHEMA nres_users;
CREATE SCHEMA nres_property;
CREATE SCHEMA nres_pending_property;
CREATE SCHEMA nres_services;
-- CREATE SCHEMA nres_unapproved_services;
CREATE SCHEMA nres_sold_property;








--- create table for store users;

-- create agent;
CREATE TABLE IF NOT EXISTS nres_users.agent 
    
    (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE , 
    phone_number VARCHAR(15) UNIQUE NOT NULL, 
    identification_type VARCHAR(50) NOT NULL,
    identification_number VARCHAR(30) NOT NULL,
    image JSON,
    password VARCHAR(255),
    status ENUM ('pending','approved','rejected') DEFAULT 'pending'
    )AUTO_INCREMENT=1 ;



-- create staff;
CREATE TABLE  IF NOT EXISTS nres_users.staff
 (id INT  PRIMARY KEY,
 name VARCHAR(255),
 email VARCHAR(255),
 password VARCHAR(255),
 UNIQUE(email) ) ;


-- create customer;
CREATE TABLE IF NOT EXISTS nres_users.customer
 (id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  email VARCHAR (50) UNIQUE,
  phone_number VARCHAR(15) NOT NULL UNIQUE,
  password VARCHAR (255) NOT NULL
 )AUTO_INCREMENT=1;


-- create password reset table;
CREATE TABLE IF NOT EXISTS nres_users.passwordResetToken (
        user_id INT  PRIMARY KEY,
        token INT NOT NULL,
        createdTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expirationTime DATETIME,
        ipAddress VARCHAR(45)
    );


-- create Agent rating table;
CREATE TABLE IF NOT EXISTS nres_users.agentRating
    (
        id INT PRIMARY KEY AUTO_INCREMENT,
        agent_id INT NOT NULL,
        customer_id INT NOT NULL,
        rating FLOAT NOT NULL,
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id),
        FOREIGN KEY ( customer_id) REFERENCES nres_users.customer(id)
        
    );


--- ------------------------------create table for store property-----------------------------;


-- create user defined variable for track property ID;
CREATE TABLE IF NOT EXISTS nres_property.property_id_tracker (

    id INT NOT NULL PRIMARY KEY,
    property_id INT

)

-- insert id = 1 and property_id 1 for default ;
INSERT INTO nres_property.property_id_tracker VALUES (1,1);
 
-- revoke insert operation in property_id_tracker
-- REVOKE INSERT ON nres_property.property_id_tracker FROM ALL;

--- create table for store apartment;


CREATE TABLE  IF NOT EXISTS nres_property.apartment
    (
        property_id INT NOT NULL UNIQUE,
        property_name varchar(50),
        listed_for 	ENUM ('sell','rent'),
        price  DECIMAL(12, 2),
        bedrooms INT,
        livingrooms INT,
        kitchen INT,
        floor INT,
        furnish BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        area_aana FLOAT,
	    area_sq_ft FLOAT,
	    road_access_ft FLOAT,
        state varchar(20),
	    district varchar(20),
	    city varchar(25),
	    ward_number INT,
	    tole_name varchar(20),
	    latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        property_image JSON,
        property_video JSON,
        posted_date DATE,
        approved_by INT  ,
        customer_id INT ,
        agent_id INT ,
        views INT DEFAULT 0,
        FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
        FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)

    );

--- create table for store house;

CREATE TABLE IF NOT EXISTS nres_property.house
    (

        property_id INT NOT NULL UNIQUE,
        property_name varchar(50),
        listed_for 	ENUM ('sell','rent'),
        price  DECIMAL(12, 2),
        bedrooms INT,
        livingrooms INT,
        kitchen INT,
        floor FLOAT,
        furnish BOOL,
        parking BOOL,
        facing_direction varchar(20),
        facilities VARCHAR(1000),
        area_aana FLOAT,
	    area_sq_ft FLOAT,
	    road_access_ft FLOAT,
        state varchar(20),
	    district varchar(20),
	    city varchar(25),
	    ward_number INT,
	    tole_name varchar(20),
	    latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        property_image JSON,
        property_video JSON,
        posted_date DATE,
        approved_by INT  ,
        customer_id INT ,
        agent_id INT ,
        views INT DEFAULT 0,
        FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
        FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)
    
    );


-- create table for store land;

CREATE TABLE IF NOT EXISTS nres_property.land (

     property_id INT NOT NULL UNIQUE,
     property_name varchar(50),
     listed_for 	ENUM ('sell','rent'),
     price  DECIMAL(12, 2),
     land_type VARCHAR(255),
     soil VARCHAR(255),   
     area_aana FLOAT,
	 area_sq_ft FLOAT,
     road_access_ft FLOAT,
     state varchar(20),
	 district varchar(20),
	 city varchar(25),
	 ward_number INT,
	 tole_name varchar(20),
	 latitude DECIMAL(9,6),
     longitude DECIMAL(9,6),
     property_image JSON,
     property_video JSON,
     posted_date DATE,
     approved_by INT  ,
     customer_id INT ,
     agent_id INT ,
     views INT DEFAULT 0,
     FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
     FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
     FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)

);


-- create table for store ads related information ;
CREATE TABLE IF NOT EXISTS nres_property.house_ads(
            id INT AUTO_INCREMENT PRIMARY KEY ,
            property_id INT NOT NULL,
            ads_status ENUM ('unplanned','posted','progress','planned') DEFAULT 'unplanned',
            FOREIGN KEY (property_id) REFERENCES nres_property.house(property_id)
            
);
-- create table for store ads related information ;
CREATE TABLE IF NOT EXISTS nres_property.apartment_ads(
            id INT AUTO_INCREMENT PRIMARY KEY ,
            property_id INT NOT NULL,
            ads_status ENUM ('unplanned','posted','progress','planned') DEFAULT 'unplanned',
            FOREIGN KEY (property_id) REFERENCES nres_property.apartment(property_id)
            
);
-- create table for store ads related information ;
CREATE TABLE IF NOT EXISTS nres_property.land_ads(
            id INT AUTO_INCREMENT PRIMARY KEY ,
            property_id INT NOT NULL,
            ads_status ENUM ('unplanned','posted','progress','planned') DEFAULT 'unplanned',
            FOREIGN KEY (property_id) REFERENCES nres_property.land(property_id)
            
);


-- create table for store house comments between staffs;
CREATE TABLE IF NOT EXISTS nres_property.house_comment(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    staff_id INT NOT NULL,
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES nres_property.house(property_id),
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)
);

-- create table for store apartment comments between staffs;
CREATE TABLE IF NOT EXISTS nres_property.apartment_comment(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    staff_id INT NOT NULL,
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES nres_property.apartment(property_id),
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)
);

-- create table for store house comments between staffs;
CREATE TABLE IF NOT EXISTS nres_property.land_comment(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    staff_id INT NOT NULL,
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES nres_property.land(property_id),
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)
);





--- create table for listing property before aproved;
--create property table;





--- create table for store apply for listin  property i.e unapproved property;


 
CREATE TABLE  IF NOT EXISTS nres_pending_property.pending_apartment
    (
        property_id INT  AUTO_INCREMENT PRIMARY KEY ,
        property_name varchar(50),
        listed_for 	ENUM ('sell','rent'),
        price  DECIMAL(12, 2),
        bedrooms INT,
        livingrooms INT,
        kitchen INT,
        floor INT,
        furnish BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        area_aana FLOAT,
	    area_sq_ft FLOAT,
	    road_access_ft FLOAT,
        state varchar(20),
	    district varchar(20),
	    city varchar(25),
	    ward_number INT,
	    tole_name varchar(20),
	    latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        property_image JSON,
        property_video JSON,
        posted_date DATE,
        approved_by INT ,
        customer_id INT ,
        agent_id INT ,
        views INT DEFAULT 0,
        FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
        FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)

    );

--- create table for store house;

CREATE TABLE IF NOT EXISTS nres_pending_property.pending_house
    (

        property_id INT  AUTO_INCREMENT PRIMARY KEY ,
        property_name varchar(50),
        listed_for 	ENUM ('sell','rent'),
        price  DECIMAL(12, 2),
        bedrooms INT,
        livingrooms INT,
        kitchen INT,
        floor FLOAT,
        furnish BOOL,
        parking BOOL,
        facing_direction varchar(20),
        facilities VARCHAR(1000),
        area_aana FLOAT,
	    area_sq_ft FLOAT,
	    road_access_ft FLOAT,
        state varchar(20),
	    district varchar(20),
	    city varchar(25),
	    ward_number INT,
	    tole_name varchar(20),
	    latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        property_image JSON,
        property_video JSON,
        posted_date DATE,
        approved_by INT  ,
        customer_id INT ,
        agent_id INT ,
        views INT DEFAULT 0,
        FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
        FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)
    
    );


-- create table for store land;

CREATE TABLE IF NOT EXISTS nres_pending_property.pending_land (

     property_id INT   AUTO_INCREMENT PRIMARY KEY ,
     property_name varchar(50),
     listed_for 	ENUM ('sell','rent'),
     price  DECIMAL(12, 2),
     land_type VARCHAR(255),
     soil VARCHAR(255),   
     area_aana FLOAT,
	 area_sq_ft FLOAT,
     road_access_ft FLOAT,
     state varchar(20),
	 district varchar(20),
	 city varchar(25),
	 ward_number INT,
	 tole_name varchar(20),
	 latitude DECIMAL(9,6),
     longitude DECIMAL(9,6),
     property_image JSON,
     property_video JSON,
     posted_date DATE,
     approved_by INT  ,
     customer_id INT ,
     agent_id INT ,
     views INT DEFAULT 0,
     FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
     FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
     FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)

);









-- Create table for sold property table;

--create property table;
CREATE TABLE IF NOT EXISTS nres_sold_property.sold_property LIKE nres_property.property;
            ALTER TABLE nres_sold_property.sold_property
            ADD COLUMN buyer_id VARCHAR(36) REFERENCES nres_users.customer(id),
            ADD COLUMN seller_id VARCHAR(36) REFERENCES nres_users.customer(id),
            ADD COLUMN buyer_agent_id VARCHAR(36) REFERENCES nres_users.agent(id),
            ADD COLUMN seller_agent_id VARCHAR(36) REFERENCES nres_users.agent(id),
            ADD COLUMN sold_approved_id VARCHAR(36) REFERENCES nres_users.staff(id),
            ADD COLUMN sold_price DECIMAL(12, 2),
            ADD COLUMN sold_date DATE,
            MODIFY COLUMN status ENUM('sold') DEFAULT 'sold';




-- Create table for service Providers ;


CREATE TABLE IF NOT EXISTS nres_services.service_provider (
    provider_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(50) UNIQUE,
    service_type VARCHAR(20) NOT NULL,
    state VARCHAR(10),
    district VARCHAR(20),
    city VARCHAR(20),
    ward_number INT,
    profile_image VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
) AUTO_INCREMENT = 1;


-- Create table for servies;

CREATE TABLE IF NOT EXISTS nres_services.service(
     service_id INT AUTO_INCREMENT ,
     provider_id INT ,
     service_type VARCHAR (20),
     PRIMARY KEY (service_id),
     FOREIGN KEY (provider_id) REFERENCES nres_services.service_provider(provider_id)
     
);


--create table for service providers rating;

CREATE TABLE IF NOT EXISTS nres_services.service_provider_rating(
    service_provider_id INT PRIMARY KEY,
    rating INT ,
    FOREIGN KEY (provider_id) REFERENCES nres_services.service_provider(provider_id)
);



-------------------------------------------------------------VIEWS------------------------------------------------------;

