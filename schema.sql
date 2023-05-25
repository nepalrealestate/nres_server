--CREATE DATABASE nres;
CREATE SCHEMA nres_users;


CREATE SCHEMA nres_property;





--- create table for store property;


    
CREATE TABLE IF NOT EXISTS nres_property.property
    (   user_id VARCHAR(36) NOT NULL,
        user_type ENUM('agent','seller','staff'),
		property_id INT NOT NULL PRIMARY KEY,
		property_type ENUM('house','apartment','land') NOT NULL,
		property_name varchar(50),
        listed_for varchar(10) NOT NULL,
        price FLOAT,
        area_aana FLOAT,
        area_sq_ft FLOAT,
        facing_direction varchar(255),
        views INT DEFAULT 0,
        state varchar(255),
        district varchar(255),
        city varchar(255),
        ward_number INT,
        tole_name varchar(255),
        approved_by_id varchar(36),
        status ENUM('approved'),
        FOREIGN KEY (approved_by_id) REFERENCES nres_users.staff(id)
    
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
        apartment_image JSON,
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
        road_access_ft FLOAT,
        facilities VARCHAR(1000),
        house_image JSON,
        FOREIGN KEY (property_id) REFERENCES nres_property.property(property_id) ON DELETE CASCADE
    
    );


-- create table for store land;

CREATE TABLE IF NOT EXISTS nres_property.land (

      property_id INT NOT NULL PRIMARY KEY UNIQUE,
      land_type VARCHAR(255),
      soil VARCHAR(255),
      road_access_ft FLOAT,
      land_image JSON,
      FOREIGN KEY (property_id) REFERENCES nres_property.property (property_id) ON DELETE CASCADE

);





--- create table for listing property before aproved;
--create property table;
CREATE TABLE nres_property.apply_property LIKE nres_property.property;
			ALTER TABLE  nres_property.apply_property 
             MODIFY COLUMN status ENUM('pending','approved','rejected') DEFAULT 'pending';


-- create apartment for listing property;
CREATE TABLE IF NOT EXISTS nres_property.apply_apartment LIKE nres_property.apartment;
    ALTER TABLE nres_property.apply_apartment
    ADD FOREIGN KEY (property_id) REFERENCES nres_property.apply_property(property_id);


--  create house for listing property;

CREATE TABLE IF NOT EXISTS nres_property.apply_house LIKE nres_property.house;
    ALTER TABLE nres_property.apply_house
    ADD FOREIGN KEY (property_id) REFERENCES nres_property.apply_property(property_id);


-- create land for listing property;

CREATE TABLE IF NOT EXISTS nres_property.apply_land LIKE nres_property.land;
    ALTER TABLE nres_property.apply_land
    ADD FOREIGN KEY (property_id) REFERENCES nres_property.apply_property(property_id);


--create view for full apartment property;

CREATE VIEW nres_property.full_apartment_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,a.bhk,a.situated_floor,
a.furnish_status,a.parking,a.facilities,a.apartment_image
 FROM nres_property.property AS p inner join nres_property.apartment as a on p.property_id = a.property_id;

 


 --create view for full house property;

CREATE VIEW nres_property.full_house_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,h.room,h.floor,
h.furnish_status,h.parking,h.road_access_ft,h.facilities,h.house_image
 FROM nres_property.property AS p inner join nres_property.house as h on p.property_id = h.property_id;




 --create view for full land property;

 CREATE VIEW nres_property.full_land_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,l.land_type,l.soil,
l.road_access_ft
FROM nres_property.property AS p inner join nres_property.land as l on p.property_id = l.property_id;
 



-- view for all apply for listing property;

--create view for apply for listing apartment property;
CREATE VIEW nres_property.apply_apartment_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,p.approved_by_id,p.status,a.bhk,a.situated_floor,
a.furnish_status,a.parking,a.facilities,a.apartment_image
FROM nres_property.apply_property AS p inner join nres_property.apply_apartment as a on p.property_id = a.property_id;


 -- create view for apply for listing house property;

CREATE VIEW nres_property.apply_house_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,p.approved_by_id,p.status,
h.room,h.floor,h.furnish_status,h.parking,h.road_access_ft,h.facilities,h.house_image
FROM nres_property.apply_property 
AS p inner join nres_property.apply_house AS h ON p.property_id = h.property_id;



-- create view for apply for listing land property;

CREATE VIEW nres_property.apply_land_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,p.approved_by_id,p.status,
l.land_type,l.soil,l.road_access_ft,l.land_image
FROM nres_property.apply_property
AS p inner join nres_property.apply_land AS l ON p.property_id = l.property_id;