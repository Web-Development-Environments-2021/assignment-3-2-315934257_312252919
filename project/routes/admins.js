var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");


router.post("/addAdmin", async function(req, res, next) {
    try{
      const admin =  (
        await DButils.execQuery(
        `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
        )
      )[0];
      if(!admin){
        throw { status: 401, message: "You don't have the permissions."};
      }
      await DButils.execQuery(
        `INSERT INTO dbo.Admins (userId) VALUES
         ('${req.body.userId}')`
      );
      res.status(201).send("admin added");
  
    }
    catch (error) {
      next(error);
    }
  
  });


  router.post("/addRepresentative", async function(req, res, next) {
    try{
      const admin =  (
        await DButils.execQuery(
        `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
        )
      )[0];
      if(!admin){
        throw { status: 401, message: "You don't have the permissions."};
      }
      await DButils.execQuery(
        `INSERT INTO dbo.AssociationRepresentative (userId) VALUES
         ('${req.body.userId}')`
      );
      res.status(201).send("association representative added");
    }
    catch (error) {
      next(error);
    }
  
  });


  module.exports = router;