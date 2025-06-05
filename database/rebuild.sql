-- Optional: Create a type if used for account_type (like 'Admin', 'Client')
-- Uncomment and adjust if needed:
-- CREATE TYPE account_type_enum AS ENUM ('Admin', 'Client');

-- 1. Drop and create the classification table
DROP TABLE IF EXISTS classification CASCADE;
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(255) NOT NULL
);

-- 2. Drop and create the account table
DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(255) UNIQUE NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'Client' -- or use account_type_enum if created
);

-- 3. Drop and create the inventory table
DROP TABLE IF EXISTS inventory CASCADE;
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INT NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    inv_price NUMERIC(10, 2) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT REFERENCES classification(classification_id)
);

-- 4. Insert classification data
INSERT INTO classification (classification_name)
VALUES 
    ('Sport'),
    ('SUV'),
    ('Truck');

-- 5. Insert inventory data
INSERT INTO inventory (
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
)
VALUES 
    ('GM', 'Hummer', 2020, 'The Hummer has a huge interior and is built to last.',
     '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg',
     55000.00, 25000, 'Black', 2),

    ('Ford', 'Mustang', 2021, 'A classic sport car.',
     '/images/vehicles/mustang.jpg', '/images/vehicles/mustang-tn.jpg',
     45000.00, 12000, 'Red', 1),

    ('Chevy', 'Camaro', 2022, 'A powerful sports coupe.',
     '/images/vehicles/camaro.jpg', '/images/vehicles/camaro-tn.jpg',
     47000.00, 8000, 'Yellow', 1);

-- ✅ Confirm inv_id = 1 exists for detail page
