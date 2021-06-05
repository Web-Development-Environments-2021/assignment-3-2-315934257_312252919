var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
// const league_utils = require("./utils/league_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    if(!req.params.teamId){
      throw {status: 400, message: "Missing parameters"};
    }
    const league_check = team_utils.checkTeamInLeague(req.params.teamId);
    if(!league_check){
      res.send({});
      return;
    }

    const team_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const team_games = await DButils.execQuery(
      `SELECT * FROM dbo.Games
       WHERE home_team='${req.params.teamId}' 
       OR away_team='${req.params.teamId}'`
       );
    game_partition = team_utils.find_past_future_games(team_games);
    res.send({team_info : team_details, past_games: game_partition.past, future_games: game_partition.future});
  } catch (error) {
    next(error);
  }
});


router.get("/search/:teamName", async (req, res, next) => {
  try {
    if(!req.params.teamName){
      throw {status: 400, message: "Missing parameters"};
    }
    const team_responses = await team_utils.getTeamByName(req.params.teamName);
    res.send(team_responses);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
