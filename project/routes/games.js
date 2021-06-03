var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.post("/addGame", async (req, res, next) => {
    try {
      if(req.session && req.session.user_id && req.body.home_team && req.body.away_team && req.body.game_date_time && req.body.field && req.body.referee_name){
        const representative =  (
          await DButils.execQuery(
          `SELECT * FROM dbo.AssociationRepresentative WHERE userId = '${req.session.user_id}'`
          )
        )[0];
        if(!representative){
          throw { status: 401, message: "You don't have the permissions."};
        }
      
        await DButils.execQuery(
            `INSERT INTO dbo.Games (home_team, away_team, game_date_time, field, referee_name) VALUES
            ('${req.body.home_team}', '${req.body.away_team}', '${req.body.game_date_time}', '${req.body.field}', '${req.body.referee_name}')`
          );
          res.status(201).send("game added");
      }
      else{
        throw { status: 400, message: "Missing arguments."}
      }

    } catch (error) {
      next(error);
    }
  });

  module.exports = router;