const argon2 = require("argon2");

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  };
  
const hashPassword = (req, res, next) => {
    argon2
      .hash(req.body.password, hashingOptions)
      .then((hashedPassword) => {
        console.log(hashedPassword);
        req.body.hashedPassword = hashedPassword;
        delete req.body.password;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  const jwt = require("jsonwebtoken");
  const verifyPassword = (req, res) => {
    argon2
      .verify(req.user.hashedPassword, req.body.password)
      .then((isVerified) => {
        if (isVerified) {
          
       
        // const secretkey = process.env.JWT_SECRET;
        // console.info("env variable value ", secretkey);
        const payload = { sub: req.body.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h"});
        // console.info("token value ", token);
        
        res.send({ token, user : req.user});
        // added ok
        } else {
          res.sendStatus(401);
        }
    
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  const verifyToken = (req, res, next) => {
    try {
      const authorizationHeader = req.get("Authorization");
  console.info("authorizationHeader" ,authorizationHeader);
      if (authorizationHeader == null) {
        throw new Error("Authorization header is missing");
      }
  
      const [type, token] = authorizationHeader.split(" ");
  
      if (type !== "Bearer") {
        throw new Error("Authorization header has not the 'Bearer' type");
      }
  
      req.payload = jwt.verify(token, process.env.JWT_SECRET);
  
      next();

    } catch (err) {
      console.error(err);
      res.sendStatus(401);
    }
  };
  
  module.exports = {
    hashPassword,
    verifyPassword, 
    verifyToken,
  };
  
