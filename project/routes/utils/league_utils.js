const axios = require("axios");
const LEAGUE_ID = 271;
const game_utils = require("./game_utils");


/*
returns league details as specified:
* the name of the league
* the name of the season
* the name of the stage(if present)
* information about the next game
* user's favorite games.
*/
async function getLeagueDetails(user_id) {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  let stage = null;
  if(league.data.data.current_stage_id){
    stage = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
  }
  let cur_stage = await axios.get("https://soccer.sportmonks.com/api/v2.0/stages/season/18334",
  {
    params: {
      api_token: process.env.api_token,
    },
  });
  return {
    league_name: league.data.data.name,
    league_logo: league.data.data.logo_path,
    current_season_name: league.data.data.season.data.name,
    // current_stage_name: stage ? stage.data.data.name : null,
    current_stage: cur_stage.data.data[1],
    // next game details should come from DB
    next_game: await game_utils.getClosestGame(),
    user_favorite_games: await game_utils.gamesInfo(user_id) 
  };

}

/*
returns the league id.
*/
function getLeagueID(){
  return LEAGUE_ID;
}

exports.getLeagueID = getLeagueID;
exports.getLeagueDetails = getLeagueDetails;
