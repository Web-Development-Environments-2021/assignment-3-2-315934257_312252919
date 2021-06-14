var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const gameUtils = require("../routes/utils/game_utils");
const team_utils = require("../routes/utils/team_utils");

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
        const homeTeamDetails = await team_utils.checkTeamInLeague(req.body.home_team)
        const awayTeamDetails = await team_utils.checkTeamInLeague(req.body.away_team)
        if(!homeTeamDetails || !awayTeamDetails){
          throw {status: 406 , message: "You can't add teams that are not part of the league."}
        }

        console.log(homeTeamDetails)
      
        await DButils.execQuery(
            `INSERT INTO dbo.Games (home_team_id, away_team_id, home_team_name, away_team_name, game_date_time, field, referee_name) VALUES
            ('${req.body.home_team}', '${req.body.away_team}', '${homeTeamDetails.name}', '${awayTeamDetails.name}', '${req.body.game_date_time}', '${req.body.field}', '${req.body.referee_name}')`
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


router.get("/stageGames", async (req, res, next) => {
  try{
    let games = await gameUtils.getGames();
    let {past, future} = gameUtils.sepPastFutureGames(games);
    let future_relevant_info = []
    future.map((game) => {
      future_relevant_info.push(
        {
          id: game.game_id,
          home_team : game.home_team_id,
          away_team : game.away_team_id,
          home_team_name: game.home_team_name,
          away_team_name: game.away_team_name,
          game_date_time : game.game_date_time,
          field : game.field
        }
      )
    });
    let past_relevant_info = []
    for(const game of past) {
      const events = await gameUtils.getGameEvents(game.game_id);
      past_relevant_info.push(
        {
          id: game.game_id,
          home_team : game.home_team_id,
          away_team : game.away_team_id,
          home_team_name: game.home_team_name,
          away_team_name: game.away_team_name,
          game_date_time : game.game_date_time,
          field : game.field,
          home_team_score : game.home_team_score,
          away_team_score : game.away_team_score,
          events : events
        }
      )
    }
    res.status(200).send({past: past_relevant_info, future: future_relevant_info});
  }
  catch (error){
    next(error);
  }
});

module.exports = router;