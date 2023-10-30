
require("dotenv").config();

const port = process.env.APP_PORT;
const express = require("express");

const app = express();
app.use(express.json()); 

// const port = 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite user list");
};

app.get("/", welcome);

const userHandlers = require("./userHandlers");
const { hashPassword, verifyPassword, verifyToken} = require("./auth.js");


// const isItDwight = (req, res) => {
//   if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
//     res.send("Credentials are valid");
//   } else {
//     res.sendStatus(401);
//   }
// };



app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword,verifyToken,userHandlers.postUser);
app.put("/api/users/:id",hashPassword,verifyToken, userHandlers.updateUser);
app.delete("/api/users/:id", verifyToken,userHandlers.deleteUser);
// app.post("/api/login", isItDwight);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
// app.post(
//   "/api/user",verifyToken, 
//   userHandlers.postUser,
  
// );


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
