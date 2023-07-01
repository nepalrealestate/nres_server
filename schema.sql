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


--- create table for store property;


 
CREATE TABLE IF NOT EXISTS nres_property.property
    (   
		property_id INT NOT NULL PRIMARY KEY,
		property_type ENUM('house','apartment','land') NOT NULL,
		property_name varchar(50),
        listed_for varchar(10) NOT NULL,
        price  DECIMAL(12, 2),
        views INT DEFAULT 0,
        area_aana FLOAT,
	    area_sq_ft FLOAT,
	    road_access_ft FLOAT,
        property_image JSON,
        property_video JSON,
        posted_date DATE,
        approved_by INT NOT NULL ,
        customer_id INT ,
        agent_id INT ,
        FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id),
        FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)
        );



--crete table for store property location ;
    
    CREATE TABLE IF NOT EXISTS nres_property.property_location (
	id INT PRIMARY KEY AUTO_INCREMENT,
	property_id INT NOT NULL,
    state varchar(20),
	district varchar(20),
	city varchar(25),
	ward_number INT,
	tole_name varchar(20),
	latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    FOREIGN KEY (property_id) REFERENCES nres_property.property(property_id)
	
);


--- create table for store apartment;

CREATE TABLE  IF NOT EXISTS nres_property.apartment
    (
        property_id INT NOT NULL PRIMARY KEY UNIQUE,
        bhk INT,
        situated_floor INT,
        furnish_status BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        FOREIGN KEY (property_id) REFERENCES nres_property.property(property_id) ON DELETE CASCADE
    
    );

--- create table for store house;

CREATE TABLE IF NOT EXISTS nres_property.house
    (
        property_id INT NOT NULL PRIMARY KEY UNIQUE,
        room INT,
        floor FLOAT,
        furnish_status BOOL,
        parking BOOL,
        facing_direction varchar(20),
        facilities VARCHAR(1000),
     
        FOREIGN KEY (property_id) REFERENCES nres_property.property(property_id) ON DELETE CASCADE
    
    );


-- create table for store land;

CREATE TABLE IF NOT EXISTS nres_property.land (

      property_id INT NOT NULL PRIMARY KEY UNIQUE,
      land_type VARCHAR(255),
      soil VARCHAR(255),   
      FOREIGN KEY (property_id) REFERENCES nres_property.property (property_id) ON DELETE CASCADE

);





--- create table for listing property before aproved;
--create property table;





--- create table for store apply for listin  property i.e unapproved property;


 
CREATE TABLE IF NOT EXISTS nres_pending_property.pending_property
    (   
		property_id INT NOT NULL PRIMARY KEY,
		property_type ENUM('house','apartment','land') NOT NULL,
		property_name varchar(50),
        listed_for varchar(10) NOT NULL,
        price  DECIMAL(12, 2),
        area_aana FLOAT,
	    area_sq_ft FLOAT,
	    road_access_ft FLOAT,
        property_image JSON,
        property_video JSON,
        posted_date DATE,
        customer_id INT ,
        agent_id INT ,
        FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
        FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)
        );



--crete table for store property location ;
    
    CREATE TABLE IF NOT EXISTS nres_pending_property.pending_property_location (
	id INT PRIMARY KEY AUTO_INCREMENT,
	property_id INT NOT NULL,
    state varchar(20),
	district varchar(20),
	city varchar(25),
	ward_number INT,
	tole_name varchar(20),
	latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    FOREIGN KEY (property_id) REFERENCES nres_pending_property.pending_property(property_id)
	
);


--- create table for store apartment;

CREATE TABLE  IF NOT EXISTS nres_pending_property.pending_apartment
    (
        property_id INT NOT NULL PRIMARY KEY UNIQUE,
        bhk INT,
        situated_floor INT,
        furnish_status BOOL,
        parking BOOL,
        facilities VARCHAR(1000),
        FOREIGN KEY (property_id) REFERENCES nres_pending_property.pending_property(property_id) ON DELETE CASCADE
    
    );

--- create table for store house;

CREATE TABLE IF NOT EXISTS nres_pending_property.pending_house
    (
        property_id INT NOT NULL PRIMARY KEY UNIQUE,
        room INT,
        floor FLOAT,
        furnish_status BOOL,
        parking BOOL,
        facing_direction varchar(20),
        facilities VARCHAR(1000),
     
        FOREIGN KEY (property_id) REFERENCES nres_pending_property.pending_property(property_id) ON DELETE CASCADE
    
    );


-- create table for store land;

CREATE TABLE IF NOT EXISTS nres_pending_property.pending_land (

      property_id INT NOT NULL PRIMARY KEY UNIQUE,
      land_type VARCHAR(255),
      soil VARCHAR(255),   
      FOREIGN KEY (property_id) REFERENCES nres_pending_property.pending_property (property_id) ON DELETE CASCADE

);

























CREATE TABLE IF NOT EXISTS nres_unapproved_property.unapproved_property LIKE nres_property.property;
			ALTER TABLE  nres_unapproved_property.unapproved_property 
             MODIFY COLUMN status ENUM('pending','approved','rejected') DEFAULT 'pending';


-- create apartment for listing property;
CREATE TABLE IF NOT EXISTS nres_unapproved_property.unapproved_apartment LIKE nres_property.apartment;
    ALTER TABLE nres_unapproved_property.unapproved_apartment
    ADD FOREIGN KEY (property_id) REFERENCES nres_unapproved_property.unapproved_property(property_id);


--  create house for listing property;

CREATE TABLE IF NOT EXISTS nres_unapproved_property.unapproved_house LIKE nres_property.house;
    ALTER TABLE nres_unapproved_property.unapproved_house
    ADD FOREIGN KEY (property_id) REFERENCES nres_unapproved_property.unapproved_property(property_id);


-- create land for listing property;

CREATE TABLE IF NOT EXISTS nres_unapproved_property.unapproved_land LIKE nres_property.land;
    ALTER TABLE nres_unapproved_property.unapproved_land
    ADD FOREIGN KEY (property_id) REFERENCES nres_unapproved_property.unapproved_property(property_id);

-- create unapproved property location table ;

CREATE TABLE IF NOT EXISTS nres_unapproved_property.unapproved_property_location LIKE nres_property.property_location;
    ALTER TABLE nres_unapproved_property.unapproved_property_location 
    ADD FOREIGN KEY (property_id) REFERENCES nres_unapproved_property.unapproved_property(property_id);

-- create unapproved property area table;
CREATE TABLE IF NOT EXISTS nres_unapproved_property.unapproved_property_area LIKE nres_property.property_area;
    ALTER TABLE nres_unapproved_property.unapproved_property_area 
    ADD FOREIGN KEY (property_id) REFERENCES nres_unapproved_property.unapproved_property(property_id);



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
)



-------------------------------------------------------------VIEWS------------------------------------------------------;

--create view for full apartment property;

CREATE VIEW nres_property.apartment_property AS SELECT p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.views,p.property_image,p.property_video,
p.posted_date,p.user_id,p.user_type,p.approved_by_id,p.status,
a.bhk,a.situated_floor,a.furnish_status,a.parking,a.facilities,
area.area_aana,area.area_sq_ft,area.road_access_ft,
location.state,location.district,location.city,location.ward_number,
location.tole_name,location.latitude,location.longitude
FROM nres_property.property AS p INNER JOIN nres_property.apartment AS a ON p.property_id = a.property_id
INNER JOIN nres_property.property_area AS area ON p.property_id = area.property_id
INNER JOIN nres_property.property_location AS location ON p.property_id = location.property_id;

 


 --create view for full house property;

CREATE VIEW nres_property.house_property AS SELECT p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.views,p.property_image,p.property_video,
p.posted_date,p.user_id,p.user_type,p.approved_by_id, p.status,
h.room,h.floor,h.furnish_status,h.parking,h.facing_direction,h.facilities,
area.area_aana,area.area_sq_ft,area.road_access_ft,
location.state,location.district,location.city,location.ward_number,
location.tole_name,location.latitude,location.longitude
FROM nres_property.property AS p inner join nres_property.house as h on p.property_id = h.property_id
INNER JOIN nres_property.property_area AS area ON p.property_id = area.property_id
INNER JOIN nres_property.property_location AS location ON p.property_id = location.property_id;




 --create view for full land property;

CREATE VIEW nres_property.land_property AS SELECT p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.views,p.property_image,p.property_video,
p.posted_date,p.user_id,p.user_type,p.approved_by_id, p.status,
l.land_type,l.soil,
area.area_aana,area.area_sq_ft,area.road_access_ft,
location.state,location.district,location.city,location.ward_number,
location.tole_name,location.latitude,location.longitude
FROM nres_property.property AS p inner join nres_property.land as l on p.property_id = l.property_id
INNER JOIN nres_property.property_area AS area ON p.property_id = area.property_id
INNER JOIN nres_property.property_location AS location ON p.property_id = location.property_id;



-- view for all apply for listing property before approved;

--create view for apply for listing apartment property;
CREATE VIEW nres_unapproved_property.unapproved_apartment_property AS SELECT p.property_id,p.property_type,
p.property_name,p.listed_for,p.price, p.user_id,p.user_type,p.approved_by_id,p.status,p.property_image,p.posted_date,
a.bhk,a.situated_floor,a.furnish_status,a.parking,a.facilities,
area.area_aana,area.area_sq_ft,area.road_access_ft,
location.state,location.district,location.city,location.ward_number,
location.tole_name,location.latitude,location.longitude
FROM nres_unapproved_property.unapproved_property AS p 
INNER JOIN nres_unapproved_property.unapproved_apartment AS a ON p.property_id = a.property_id
INNER JOIN nres_unapproved_property.unapproved_property_area AS area ON p.property_id = area.property_id
INNER JOIN nres_unapproved_property.unapproved_property_location AS location ON p.property_id = location.property_id;


 -- create view for apply for listing house property;

CREATE VIEW nres_unapproved_property.unapproved_house_property AS SELECT p.property_id,p.property_type,
p.property_name,p.listed_for,p.price, p.user_id,p.user_type,p.approved_by_id,p.status,p.property_image,p.posted_date,
h.room,h.floor,h.furnish_status,h.parking,h.facing_direction,h.facilities,
area.area_aana,area.area_sq_ft,area.road_access_ft,
location.state,location.district,location.city,location.ward_number,
location.tole_name,location.latitude,location.longitude
FROM nres_unapproved_property.unapproved_property AS p 
INNER JOIN nres_unapproved_property.unapproved_house AS h ON p.property_id = h.property_id
INNER JOIN nres_unapproved_property.unapproved_property_area AS area ON p.property_id = area.property_id
INNER JOIN nres_unapproved_property.unapproved_property_location AS location ON p.property_id = location.property_id;



-- create view for apply for listing land property;

CREATE VIEW nres_unapproved_property.unapproved_land_property AS SELECT p.property_id,p.property_type,
p.property_name,p.listed_for,p.price, p.user_id,p.user_type,p.approved_by_id,p.status,p.property_image,p.posted_date,
l.land_type,l.soil,
area.area_aana,area.area_sq_ft,area.road_access_ft,
location.state,location.district,location.city,location.ward_number,
location.tole_name,location.latitude,location.longitude
FROM nres_unapproved_property.unapproved_property AS p 
INNER JOIN nres_unapproved_property.unapproved_land AS l ON p.property_id = l.property_id
INNER JOIN nres_unapproved_property.unapproved_property_area AS area ON p.property_id = area.property_id
INNER JOIN nres_unapproved_property.unapproved_property_location AS location ON p.property_id = location.property_id;
