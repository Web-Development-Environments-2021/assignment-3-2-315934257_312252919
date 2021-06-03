var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

router.get("/getPreviewDetails/:playerId", async (req, res, next) => {
    try {
        if(!req.params.playerId){
            throw {status: 400, message: "Missing parameters"};
        }
        const player_details = await players_utils.getPlayersInfo([req.params.playerId], false);
    //     const player_details = {
    //         "name": "James Forrest",
    //         "image": "https://cdn.sportmonks.com/images/soccer/players/8/172104.png",
    //         "position": 3,
    //         "team_name": "Celtic"
    //     };
        if(player_details.length == 0){
            res.status(404).send("No player with given id was found");
            return;
        }
        res.send(player_details[0]);
      } catch (error) {
        next(error);
      }
    });

router.get("/search/:playerName", async (req, res, next) => {
    try{
        if(!req.params.playerName){
            throw {status: 400, message: "Missing parameters"};
        }
        const players_details = await players_utils.getPlayerDetailsByName(req.params.playerName, req.query);
        res.send(players_details);
    } catch(error){
        next(error);
    }

    
});

router.get("/getFullDetails/:playerId", async (req, res, next) => {
    try {
        if(!req.params.playerId){
            throw {status: 400, message: "Missing parameters"};
        }
        const player_details = await players_utils.getPlayersInfo([req.params.playerId], true);
        // const player_details = {
        //     "name": "James Forrest",
        //     "image": "https://cdn.sportmonks.com/images/soccer/players/8/172104.png",
        //     "position": 3,
        //     "team_name": "Celtic",
        //     "common_name": "J. Forrest",
        //     "nationality": "Scotland",
        //     "birthdate": "07/07/1991",
        //     "birthcountry": "Scotland",
        //     "height": "175 cm",
        //     "weight": null
        // }

        if(player_details.length == 0){
            res.status(404).send("No player with given id was found");
            return;
        }

        res.send(player_details[0]);
        } catch (error) {
        next(error);
        }
    });

module.exports = router;
