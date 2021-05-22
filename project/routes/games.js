var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.post("/addGame", async (req, res, next) => {
    try {
    //   const user = (
    //     await DButils.execQuery(
    //       `SELECT * FROM dbo.Users WHERE username = '${req.body.username}'`
    //     )
    //   )[0];
    //   // user = user[0];
    //   console.log(user);
  
    await DButils.execQuery(
        `INSERT INTO dbo.Games (home_team, away_team, game_date_time) VALUES
         ('${req.body.home_team}', '${req.body.away_team}', '${req.body.game_date_time}')`
      );
      res.status(201).send("game added");
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;