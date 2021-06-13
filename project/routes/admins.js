var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.use(async function (req, res, next) {
  try{
    if(req.session && req.session.user_id){
      const admin =  (
        await DButils.execQuery(
        `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
        )
      )[0];
        if(!admin){
          throw { status: 401, message: "You don't have Admin permissions."};
        }
      }
  else{
      res.status(401).send("No Admin permissions");
    }
  }
  catch(error){
    next(error);
  }
  next();
});

router.post("/addAdmin", async function(req, res, next) {
    try{
        // const admin =  (
        //   await DButils.execQuery(
        //   `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
        //   )
        // )[0];
        // if(!admin){
        //   throw { status: 401, message: "You don't have the permissions."};
        // }
        // if(!req.body.userId){
        //   throw { status: 400, message: "Please specify a user to add as an admin."}
        // }
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
      // const admin =  (
      //   await DButils.execQuery(
      //   `SELECT * FROM dbo.Admins WHERE userId = '${req.session.user_id}'`
      //   )
      // )[0];
      // if(!admin){
      //   throw { status: 401, message: "You don't have the permissions."};
      // }
      // if(!req.body.userId){
      //   throw { status: 400, message: "Please specify a user to add as representative."}
      // }
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

router.get("/getNonAdminUsers", async function(req, res, next){
  try{
    const nonAdmins = await DButils.execQuery(
      `SELECT user_id, username FROM dbo.Users U
      LEFT JOIN dbo.Admins A ON U.user_id = A.userId
      WHERE A.userId IS NULL`
    )
    res.status(200).send(nonAdmins);
  }
  catch(error){
    next(error)
  }
});

router.get("/getNonRepUsers", async function(req, res, next){
  try{
    const nonAdmins = await DButils.execQuery(
      `SELECT user_id, username FROM dbo.Users U
      LEFT JOIN dbo.AssociationRepresentative AR ON U.user_id = AR.userId
      WHERE AR.userId IS NULL`
    )
    res.status(200).send(nonAdmins);
  }
  catch(error){
    next(error)
  }
});

  module.exports = router;