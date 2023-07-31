--CREATE DATABASE nres;
CREATE SCHEMA nres_users;
CREATE SCHEMA nres_property;
CREATE SCHEMA nres_pending_property;
CREATE SCHEMA nres_services;
-- CREATE SCHEMA nres_unapproved_services;
CREATE SCHEMA nres_sold_property;
CREATE SCHEMA nres_chat;







--- create table for store users;


-- create table for super admin;

CREATE TABLE  IF NOT EXISTS nres_users.super_admin
(   
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50), 
    password VARCHAR(255),
    UNIQUE(email) 

) AUTO_INCREMENT=1;


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
 (id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50),
 email VARCHAR(50),
 password VARCHAR(255),
 UNIQUE(email) )AUTO_INCREMENT=1; 


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


-- CREATE table for store staff activity log;
CREATE TABLE IF NOT EXISTS nres_users.staff_activity_log(
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    action_type ENUM ("update","insert","delete","approve","reject","comment"),
    action_description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)
);




---------------------------------create table for store property-----------------------------;


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
        property_type ENUM ('apartment') DEFAULT 'apartment',
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
        property_type ENUM ('house') DEFAULT 'house',
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
     property_type ENUM ('land') DEFAULT  'land',
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
     FOREIGN KEY (approved_by) REFERENCES nres_users.staff(id) ,
     FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id),
     FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)

);


-- create table for store ads related information ;
CREATE TABLE IF NOT EXISTS nres_property.house_ads(
            id INT AUTO_INCREMENT PRIMARY KEY ,
            property_id INT NOT NULL,
            ads_status ENUM ('unplanned','posted','progress','planned') DEFAULT 'unplanned',
            FOREIGN KEY (property_id) REFERENCES nres_property.house(property_id) ON DELETE CASCADE
            
);
-- create table for store ads related information ;
CREATE TABLE IF NOT EXISTS nres_property.apartment_ads(
            id INT AUTO_INCREMENT PRIMARY KEY ,
            property_id INT NOT NULL,
            ads_status ENUM ('unplanned','posted','progress','planned') DEFAULT 'unplanned',
            FOREIGN KEY (property_id) REFERENCES nres_property.apartment(property_id)  ON DELETE CASCADE
            
);
-- create table for store ads related information ;
CREATE TABLE IF NOT EXISTS nres_property.land_ads(
            id INT AUTO_INCREMENT PRIMARY KEY ,
            property_id INT NOT NULL,
            ads_status ENUM ('unplanned','posted','progress','planned') DEFAULT 'unplanned',
            FOREIGN KEY (property_id) REFERENCES nres_property.land(property_id)  ON DELETE CASCADE
            
);


-- create table for store house comments between staffs;
CREATE TABLE IF NOT EXISTS nres_property.house_comment(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    staff_id INT ,
    super_admin_id INT ,
    comment TEXT,
    is_private BOOL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES nres_property.house(property_id)  ON DELETE CASCADE, 
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)  ON DELETE CASCADE,
    FOREIGN KEY (super_admin_id) REFERENCES nres_users.super_admin(id)  ON DELETE CASCADE,
    CONSTRAINT house_check_staff_super_admin CHECK (
        (staff_id IS NOT NULL AND super_admin_id IS NULL) OR 
        (staff_id IS NULL AND super_admin_id IS NOT NULL)
    ),
    CONSTRAINT house_check_is_private CHECK (
        (staff_id IS NOT NULL AND is_private = FALSE ) OR 
        (staff_id IS NULL)
    )
);

-- create table for store apartment comments between staffs;
CREATE TABLE IF NOT EXISTS nres_property.apartment_comment(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    staff_id INT ,
    super_admin_id INT ,
    comment TEXT,
    is_private BOOL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES nres_property.apartment(property_id)  ON DELETE CASCADE,  
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)  ON DELETE CASCADE,
    FOREIGN KEY (super_admin_id) REFERENCES nres_users.super_admin(id)  ON DELETE CASCADE,
    CONSTRAINT apartment_check_staff_super_admin CHECK (
        (staff_id IS NOT NULL AND super_admin_id IS NULL) OR 
        (staff_id IS NULL AND super_admin_id IS NOT NULL)
    ),
    CONSTRAINT apartment_check_is_private CHECK (
        (staff_id IS NOT NULL AND is_private = FALSE ) OR 
        (staff_id IS NULL)
    )
);

-- create table for store house comments between staffs;
CREATE TABLE IF NOT EXISTS nres_property.land_comment(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    staff_id INT ,
    super_admin_id INT ,
    comment TEXT,
    is_private BOOL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES nres_property.land(property_id)  ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)  ON DELETE CASCADE,
    FOREIGN KEY (super_admin_id) REFERENCES nres_users.super_admin(id)  ON DELETE CASCADE,
    CONSTRAINT land_check_staff_super_admin CHECK (
        (staff_id IS NOT NULL AND super_admin_id IS NULL) OR 
        (staff_id IS NULL AND super_admin_id IS NOT NULL)
    ),
    CONSTRAINT land_check_is_private CHECK (
        (staff_id IS NOT NULL AND is_private = FALSE ) OR 
        (staff_id IS NULL)
    )
);





--- create table for listing property before aproved;
--create property table;





--- create table for store apply for listin  property i.e unapproved property;


 
CREATE TABLE  IF NOT EXISTS nres_pending_property.pending_apartment
    (
        property_id INT  AUTO_INCREMENT PRIMARY KEY ,
        property_type ENUM ('apartment') DEFAULT  'apartment',
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
        property_type ENUM ('house') DEFAULT  'house',
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
    property_type ENUM ('land') DEFAULT  'land',
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


-----------------------------------------------------------CHATS--------------------------------------------------;


--- CREATE TABLE for store chats between users and admin;

CREATE TABLE IF NOT EXISTS nres_chat.customer_chat(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL ,
    receiver_id INT NOT NULL,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE for store chat started users;

CREATE TABLE IF NOT EXISTS nres_chat.customer_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    FOREIGN KEY (customer_id) REFERENCES nres_users.customer(id)
);

-- CREATE TABLE For store agents chat;
CREATE TABLE IF  NOT EXISTS nres_chat.agent_chat(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE for store agent chat list;
CREATE TABLE IF NOT EXISTS nres_chat.agent_list(
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_id INT NOT NULL UNIQUE,
    FOREIGN KEY (agent_id) REFERENCES nres_users.agent(id)
);


--CREATE table for store chats between staff and admins;

CREATE TABLE IF NOT EXISTS nres_chat.staff_chat(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL , 
    receiver_id INT NOT NULL,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--CREATE TABLE FOR store chat started staff i.e all staff ;

CREATE TABLE IF NOT EXISTS nres_chat.staff_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL UNIQUE,
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)
);

--CREATE TABLE for store staff_list for group chat;

CREATE TABLE IF NOT EXISTS nres_chat.staff_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL UNIQUE,
    FOREIGN KEY (staff_id) REFERENCES nres_users.staff(id)
);


--CREATE TABLE FOR store group chat beetween staff and admin;

CREATE TABLE IF NOT EXISTS nres_chat.staff_group_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL ,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);







-------------------------------------------------------------VIEWS------------------------------------------------------;

-- create view for latest _ property dashboard;
create view nres_property.latest_property_dashboard as

SELECT  LPAD(h.property_id, 4, "0") AS property_id,h.property_type, h.property_name,h.listed_for, h.tole_name, h.ward_number,h.city, h.posted_date ,
 ha.ads_status
FROM nres_property.house as h INNER JOIN nres_property.house_ads as ha ON h.property_id = ha.property_id
UNION 
SELECT LPAD(l.property_id, 4, "0") AS property_id,l.property_type, l.property_name,l.listed_for,  l.tole_name, l.ward_number,l.city, l.posted_date ,
 la.ads_status
FROM nres_property.land as l INNER JOIN nres_property.land_ads as la ON l.property_id = la.property_id
UNION 
SELECT LPAD(a.property_id, 4, "0") AS property_id,a.property_type, a.property_name, a.listed_for, a.tole_name, a.ward_number,a.city, a.posted_date ,
 aa.ads_status
FROM nres_property.apartment as a INNER JOIN nres_property.apartment_ads as aa ON a.property_id = aa.property_id;


-- create view for latest_property;

-- create view nres_property.all_property_dashboard as

-- SELECT h.property_id,h.property_type, h.property_name, h.tole_name, h.ward_number,h.city, h.posted_date ,
--  ha.ads_status
-- FROM nres_property.house as h INNER JOIN nres_property.house_ads as ha ON h.property_id = ha.property_id
-- UNION 
-- SELECT l.property_id,l.property_type, l.property_name, l.tole_name, l.ward_number,l.city, l.posted_date ,
--  la.ads_status
-- FROM nres_property.land as l INNER JOIN nres_property.land_ads as la ON l.property_id = la.property_id
-- UNION 
-- SELECT a.property_id,a.property_type, a.property_name, a.tole_name, a.ward_number,a.city, a.posted_date ,
--  aa.ads_status
-- FROM nres_property.apartment as a INNER JOIN nres_property.apartment_ads as aa ON a.property_id = aa.property_id;