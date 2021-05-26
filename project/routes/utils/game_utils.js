const DButils = require("./DButils");

async function getGameInfo(user_id, game_id){
    let game_info = await DButils.execQuery(
        `select home_team, away_team, game_date_time, field from Games where game_id='${game_id}'`
      );
    if (game_info.length == 0 || game_info[0].game_date_time < Date.now()){
        await DButils.execQuery(
            `DELETE FROM UsersFavoriteGames where user_id='${user_id}' AND game_id='${game_id}'`
        );
        return null;
    }
    return game_info[0];
}

exports.getGameInfo = getGameInfo;