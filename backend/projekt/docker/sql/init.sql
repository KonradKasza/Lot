DROP TABLE IF EXISTS airports;

CREATE TABLE IF NOT EXISTS airports (
    airport_id INTEGER PRIMARY KEY,
    name TEXT,
    city TEXT,
    country TEXT,
    iata VARCHAR(10),
    icao VARCHAR(10),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    altitude INTEGER,
    timezone FLOAT
);

COPY airports(airport_id, name, city, country, iata, icao, latitude, longitude, altitude, timezone)
FROM '/import/airports.csv'
DELIMITER ',' 
CSV HEADER;
ENCODING 'UTF8';
