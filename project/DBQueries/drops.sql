-- A VERY DANGEROUS FILE - WATCH OUT!!!

IF OBJECT_ID('dbo.AssociationRepresentative', 'U') IS NOT NULL
DROP TABLE dbo.AssociationRepresentative
GO

IF OBJECT_ID('dbo.Admins', 'U') IS NOT NULL
DROP TABLE dbo.Admins
GO

IF OBJECT_ID('dbo.UsersFavoriteGames', 'U') IS NOT NULL
DROP TABLE dbo.UsersFavoriteGames
GO

IF OBJECT_ID('dbo.Events', 'U') IS NOT NULL
DROP TABLE dbo.Events
GO

IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO

IF OBJECT_ID('dbo.Referees', 'U') IS NOT NULL
DROP TABLE dbo.Referees
GO

IF OBJECT_ID('dbo.Games', 'U') IS NOT NULL
DROP TABLE dbo.Games
GO