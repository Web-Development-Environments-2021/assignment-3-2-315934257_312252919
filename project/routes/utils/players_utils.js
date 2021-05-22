const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list, full_details) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  if(full_details){
    return extractAllData(players_info);
  }
  return extractRelevantPlayerData(players_info);
}

function extractAllData(players_info){
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id,
            common_name, nationality, birthdate,
            birthcountry, height, weight } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      common_name: common_name,
      nationality: nationality,
      birthdate: birthdate,
      birthcountry: birthcountry,
      height: height,
      weight: weight
    };
  });
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

function extractRelevantPlayerDataByName(players_info) {
  let ret = []
  players_info.map((player_info) => {
    if(player_info.country_id === 320){
      const { fullname, image_path, position_id } = player_info;
      let name = null;
      if(player_info.team){
        name = player_info.team.data.name;
      }

      ret.push({
        name: fullname,
        image: image_path,
        position: position_id,
        team_name: name,
      })
    }
  });
  return ret;
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list, false);
  return players_info;
}

async function getPlayerDetailsByName(player_name){
  const players = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team",
    },
  });
  return extractRelevantPlayerDataByName(players.data.data);
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayerDetailsByName = getPlayerDetailsByName;
exports.getPlayersInfo = getPlayersInfo;
