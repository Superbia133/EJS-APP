-- Optional: Create a type if used for account_type (like 'Admin', 'Client')
-- Uncomment and adjust if needed:
-- CREATE TYPE account_type_enum AS ENUM ('Admin', 'Client');

-- 1. Create the classification table
DROP TABLE IF EXISTS classification CASCADE;
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(255) NOT NULL
);

-- 2. Create the account table
DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(255) UNIQUE NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'Client' -- or use account_type_enum if you created the type
);

-- 3. Create the inventory table
DROP TABLE IF EXISTS inventory CASCADE;
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    classification_id INT REFERENCES classification(classification_id)
);

-- 4. Insert data into classification
INSERT INTO classification (classification_name)
VALUES 
    ('Sport'),
    ('SUV'),
    ('Truck');

-- 5. Insert data into inventory
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES 
    ('GM', 'Hummer', 'The Hummer has small interiors but is built to last.', '/images/hummer.jpg', '/images/hummer-tn.jpg', 2),
    ('Ford', 'Mustang', 'A classic sport car.', '/images/mustang.jpg', '/images/mustang-tn.jpg', 1),
    ('Chevy', 'Camaro', 'A powerful sports coupe.', '/images/camaro.jpg', '/images/camaro-tn.jpg', 1);

-- 6. FROM assignment2.sql - Replace description text for GM Hummer
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 7. FROM assignment2.sql - Update image paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
