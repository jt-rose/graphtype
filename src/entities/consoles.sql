-- raw sql equivalent of consoles table for comparison
CREATE TYPE HOME_OR_HANDHELD AS ENUM ('home', 'handheld');
CREATE TABLE consoles_2 (
    console VARCHAR(255) CONSTRAINT console_key PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    year_released BIGINT NOT NULL,
    console_type HOME_OR_HANDHELD NOT NULL,
    maker VARCHAR(255) REFERENCES console_makers (maker)
);
INSERT INTO consoles_2
VALUES (
        'DC2',
        'DreamCast 2',
        3000,
        'home',
        'Sega'
    );
SELECT *
FROM consoles
WHERE console = 'dc2';