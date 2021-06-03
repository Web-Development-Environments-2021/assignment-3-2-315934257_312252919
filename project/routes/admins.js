var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");


router.post("/addAdmin", async function(req, res, next) {
    try{
      if(req.session && req.session.user_id){
        const admin =  (
          await DButils.execQuery(
          `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
          )
        )[0];
        if(!admin){
          throw { status: 401, message: "You don't have the permissions."};
        }
        if(!req.body.userId){
          throw { status: 400, message: "Please specify a user to add as an admin."}
        }
        await DButils.execQuery(
          `INSERT INTO dbo.Admins (userId) VALUES
           ('${req.body.userId}')`
        );
        res.status(201).send("admin added");
      }
      else{
        throw { status: 401, message: "You don't have the permissions."};
      }
    }
    catch (error) {
      next(error);
    }
  
  });


router.post("/addRepresentative", async function(req, res, next) {
  try{
    if(req.session && req.session.user_id){
      const admin =  (
        await DButils.execQuery(
        `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
        )
      )[0];
      if(!admin){
        throw { status: 401, message: "You don't have the permissions."};
      }
      if(!req.body.userId){
        throw { status: 400, message: "Please specify a user to add as representative."}
      }
      await DButils.execQuery(
        `INSERT INTO dbo.AssociationRepresentative (userId) VALUES
          ('${req.body.userId}')`
      );
      res.status(201).send("association representative added");
    }
    else{
      throw { status: 401, message: "You don't have the permissions."};
    }
    
  }
  catch (error) {
    next(error);
  }

});

  module.exports = router;