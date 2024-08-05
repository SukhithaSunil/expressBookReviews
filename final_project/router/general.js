const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body
  console.log(users)
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password })
      return res.send('user successfully registered');
    }
    else
      return res.status(300).json({ message: "username already exists" });
  }
  else {
    return res.status(300).json({ message: "username &/ password are not provided" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify({ books }, null, 1));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params
  if (books[isbn])
    return res.send(books[isbn])
  else
    return res.status(300).json({ message: `No book available on ${isbn}` });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params
  let booksByAuthor = findBook("author", author)
  console.log(booksByAuthor)
  if (Object.keys(booksByAuthor).length < 1)
    return res.status(300).json({ message: "Author not found" });
  else
    return res.send(booksByAuthor)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params
  let book = findBook("title", title)
  if (Object.keys(book).length < 1)
    return res.status(300).json({ message: "Title not found" });
  else
    return res.send(book)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params
  if (books[isbn])
    return res.send(books[isbn].reviews)
  else
    return res.status(300).json({ message: `No book available on ${isbn}` });
});

const findBook = (searchBy, value) => {
  let booksByAuthor = {}
  Object.keys(books).forEach(key => {
    if (books[key][searchBy] === value) {
      booksByAuthor = books[key]
      return
    }
  })
  return booksByAuthor
}

module.exports.general = public_users;
