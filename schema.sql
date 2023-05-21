CREATE DATABASE nres;
CREATE SCHEMA nres_users;

CREATE SCHEMA nres_property;



--create view for full apartment property

CREATE VIEW full_apartment_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.status,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,a.bhk,a.situated_floor,
a.furnish_status,a.parking,a.facilities,a.apartment_image
 FROM nres_property.property AS p inner join nres_property.apartment as a on p.property_id = a.property_id;

 


 --create view for full house property

CREATE VIEW full_house_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.status,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,h.room,h.floor,
h.furnish_status,h.parking,h.road_access_ft,h.facilities
 FROM nres_property.property AS p inner join nres_property.house as h on p.property_id = h.property_id;




 --create view for full land property

 CREATE VIEW full_land_property AS SELECT p.user_id,p.user_type,p.property_id,p.property_type,
p.property_name,p.listed_for,p.status,p.price,p.area_aana,
p.area_sq_ft,p.facing_direction,p.views,p.state,p.district,
p.city,p.ward_number,p.tole_name,l.land_type,l.soil,
l.road_access_ft
FROM nres_property.property AS p inner join nres_property.land as l on p.property_id = l.property_id;
 