var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");


router.use(async function (req, res, next) {
    try{
        if(req.session && req.session.user_id){
            const rep =  (
                await DButils.execQuery(
                `SELECT * FROM dbo.AssociationRepresentative WHERE userId = '${req.session.user_id}'`
                )
              )[0];
              if(!rep){
                throw { status: 401, message: "You don't have Association Representative permissions."};
              }
            }
        else{
            res.status(401).send("No Association Representative permissions");
        }
    }
    catch(error){
        next(error);
    }
    next();
})


router.post("/addGameResult", async function(req, res, next){
    try{
    //   const rep =  (
    //     await DButils.execQuery(
    //     `SELECT * FROM dbo.AssociationRepresentative WHERE userId = '${req.session.user_id}'`
    //     )
    //   )[0];
    //   if(!rep){
    //     throw { status: 401, message: "You don't have Association Representative permissions."};
    //   }
      await DButils.execQuery(
        `UPDATE dbo.Games
         SET home_team_score = '${req.body.home_team_score}', away_team_score = '${req.body.away_team_score}'
         WHERE game_id = '${req.body.game_id}'`
      );
      res.status(201).send("game updated");
    }
    catch(error){
      next(error);
    }
});

router.post("/addEventSchedule", async function(req, res, next) {
    try{
        if(req.body.game_id){
            const game =  (
                await DButils.execQuery(
                `SELECT * FROM dbo.Games WHERE game_id = '${req.body.game_id}'`
                )
              )[0];
              if(!game){
                throw { status: 401, message: "There's no such a game with given id."};
              }
              console.log(game.game_date_time)
            await DButils.execQuery(
            `INSERT INTO dbo.Events (game_id, game_date, game_time, game_minute, title, description) VALUES
                ('${req.body.game_id}', '${String(game.game_date_time).slice(0,16)}', '${req.body.game_time}' ,'${req.body.game_minute}', '${req.body.title}', '${req.body.description}')`
            );
            res.status(201).send("event added");
        }
    }
    catch(err){
        next(err);
    }
});



  module.exports = router;
