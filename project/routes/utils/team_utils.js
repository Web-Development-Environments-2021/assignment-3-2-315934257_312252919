const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const leauge_utils = require("./league_utils");


/*
searches for teams with given name and returns them - team name and team logo
*/
async function getTeamByName(team_name){
    let league_teams_list = []
    const teams_list = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
          api_token: process.env.api_token,
          include: "league"
        },
      });

    //#region 
    // const teams_list_data = {
    //     data: [
    //       {
    //         id: 211,
    //         legacy_id: 631,
    //         name: 'Horsens',
    //         short_code: 'ACH',
    //         twitter: null,
    //         country_id: 320,
    //         national_team: false,
    //         founded: 1994,
    //         logo_path: 'https://cdn.sportmonks.com/images//soccer/teams/19/211.png',
    //         venue_id: 5661,
    //         current_season_id: 17328,
    //         is_placeholder: false
    //       }
    //     ],
    //     meta: { plans: [ [Object] ], sports: [ [Object], [Object] ] }
    //   }
    //   console.log(teams_list.data);
    //#endregion

    teams_list.data.data.map((team) => {
        if(team.league.data.id === leauge_utils.getLeagueID()){
          team_relevant_info = {name: team.name, logo: team.logo_path}
            league_teams_list.push(team_relevant_info);
        }
    });
    console.log(league_teams_list)
    return league_teams_list;
}


/*
returns team data by given team_id.
*/
async function getTeamById(team_id){
  const team_data = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      api_token: process.env.api_token,
      include: "league"
    },
  });
  return team_data;
}

/*
sets apart past and future games.
*/
function find_past_future_games(team_games){
  past_games = [];
  future_games = [];
  team_games.map((game) => {game.game_date_time < Date.now() ?
      past_games.push(game) : future_games.push(game)})
  return {past: past_games, future: future_games};
}

// find_past_future_games = (team_games) => {
//   past_games = [];
//   future_games = [];
//   team_games.map((game) => {game.game_date_time < Date.now() ?
//       past_games.push(game) : future_games.push(game)})
//   return {past: past_games, future: future_games};
// }


exports.getTeamByName = getTeamByName;
exports.getTeamById = getTeamById;
exports.find_past_future_games = find_past_future_games;