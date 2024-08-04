const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  isUserAvailable = users.filter(user => user.username === username)
  if (isUserAvailable.length < 1) {
    return false
  }
  else
    return true
}

const authenticatedUser = (username, password) => { //returns boolean
  isMatch = users.filter(user => (user.username === username && user.password === password))
  if (isMatch.length < 1) {
    return false
  }
  else
    return true
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    if (isValid(username)) {
      let token = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 })
      req.session['authorization'] = { accessToken: token, username }
      return res.status(200).json({ message: "User successfully loged in" });
    }
    else
      return res.status(300).json({ message: "username doesn't exists" });
  }
  else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
