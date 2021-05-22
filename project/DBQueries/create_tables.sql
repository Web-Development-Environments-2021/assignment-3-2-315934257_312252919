-- Create a new table called 'Users' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Users
(
    -- primary key column
    user_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    username [NVARCHAR](50) NOT NULL UNIQUE,
    first_name [NVARCHAR](50) NOT NULL,
    last_name [NVARCHAR](50) NOT NULL,
    country [NVARCHAR](50),
    pswd [NVARCHAR](MAX) NOT NULL,
    email [NVARCHAR](50) NOT NULL,
    img_url [NVARCHAR](MAX),
    favourites INT
);
GO

Create a new table called 'Referees' in schema 'dbo'
Drop the table if it already exists
IF OBJECT_ID('dbo.Referees', 'U') IS NOT NULL
DROP TABLE dbo.Referees
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Referees
(
    referee_id INT NOT NULL PRIMARY KEY,
    first_name [NVARCHAR](50) NOT NULL,
    last_name [NVARCHAR](50) NOT NULL,
    age INT NOT NULL
);
GO

-- Create a new table called 'Games' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Games', 'U') IS NOT NULL
DROP TABLE dbo.Games
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Games
(
    -- primary key column
    game_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    home_team INT NOT NULL,
    away_team INT NOT NULL,
    game_date_time DATETIME NOT NULL,
    field INT,
    score INT,
    referee_id INT FOREIGN KEY REFERENCES Referees(referee_id)
);
GO