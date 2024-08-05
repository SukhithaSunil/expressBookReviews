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
  console.log(users)
  if (username && password) {
    if (isValid(username)) {
      if (authenticatedUser(username, password)) {
        let token = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 })
        req.session['authorization'] = { accessToken: token, username }
        return res.status(200).json({ message: "User successfully loged in" });
      }
      else {
        return res.status(300).json({ message: "Invalid Login. Check username and password" });
      }
    }
    else
      return res.status(300).json({ message: "username doesn't exists" });
  }
  else {
    return res.status(208).json({ message: "username &/ password are not provided." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const { review } = req.body
  const username = req.user.data
  const book = books[isbn]
  console.log(book.reviews)
  if (book) {
    const currentReviews = book.reviews
    currentReviews[username] = review
    console.log(book.reviews)
    return res.send(`review added/modified for book available on isbn:${isbn}`);
  }
  else
    return res.status(300).json({ message: `No book available on ${isbn}` });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const username = req.user.data
  const book = books[isbn]
  console.log(book.reviews)
  if (book) {
    const currentReviews = book.reviews
    if (currentReviews[username]) {
      delete currentReviews[username]
      console.log(currentReviews)
      return res.send(`review deleted for book available on isbn:${isbn}`);
    }
    else
      return res.send(`no review for book available on isbn:${isbn}`);
  }
  else
    return res.status(300).json({ message: `No book available on ${isbn}` });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
