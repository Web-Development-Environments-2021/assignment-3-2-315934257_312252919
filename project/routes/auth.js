var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists

    // one of the essential parts of user is missing
    if(!req.body.username || !req.body.password ||
       !req.body.first_name || !req.body.last_name || !req.body.email || !req.body.country){
        throw {status: 401, message: "Key component for user is missing"}
    }
    const users = await DButils.execQuery(
      "SELECT username FROM dbo.Users"
    );

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    if(req.body.img_url){
      await DButils.execQuery(
        `INSERT INTO dbo.Users (username, first_name, last_name, pswd, email, country, img_url) VALUES
        ('${req.body.username}', '${req.body.first_name}', '${req.body.last_name}', '${hash_password}', '${req.body.email}', '${req.body.country}', '${req.body.img_url}')`
      );
    }
    else{
      await DButils.execQuery(
        `INSERT INTO dbo.Users (username, first_name, last_name, pswd, email, country) VALUES
        ('${req.body.username}', '${req.body.first_name}', '${req.body.last_name}', '${hash_password}', '${req.body.email}', '${req.body.country}')`
      );
    }

    
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    let user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.Users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.pswd)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});



module.exports = router;
