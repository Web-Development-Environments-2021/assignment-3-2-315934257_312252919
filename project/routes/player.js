var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

router.get("/getPreviewDetails/:playerId", async (req, res, next) => {
    try {
        if(!req.params.playerId){
            throw {status: 400, message: "Missing parameters"};
        }
        const player_details = await players_utils.getPlayersInfo([req.params.playerId], false);
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
