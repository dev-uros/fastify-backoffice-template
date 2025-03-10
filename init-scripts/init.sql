-- Drop the pets table if it already exists (optional, to ensure clean setup)
DROP TABLE IF EXISTS pets;

-- Create the pets table
CREATE TABLE pets (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Unique identifier
    animal_type VARCHAR(50) NOT NULL,  -- Type of the animal (e.g., Dog, Cat)
    name VARCHAR(50) NOT NULL,         -- Animal's name
    nickname VARCHAR(50),              -- Optional nickname
    date_of_birth DATE NOT NULL,       -- Date of birth
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Record update timestamp
);

-- Insert sample data into the pets table
INSERT INTO pets (animal_type, name, nickname, date_of_birth) VALUES
('Dog', 'Buddy', 'Bud', '2020-05-10'),
('Cat', 'Whiskers', 'Whisky', '2018-08-22'),
('Rabbit', 'Snowball', NULL, '2022-01-15'),
('Parrot', 'Polly', 'Chatterbox', '2019-03-30'),
('Hamster', 'Hammy', 'Speedy', '2021-07-18');


-- Trigger to update 'updated_at' when a row is modified
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pets_updated_at
BEFORE UPDATE ON pets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Drop the pets table if it already exists (optional, to ensure clean setup)
DROP TABLE IF EXISTS users;

-- Create the pets table
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Unique identifier
    name VARCHAR(50) NOT NULL
);

-- Insert sample data into the pets table
INSERT INTO users (name) VALUES
('ADMIN');
