const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const dbUrl = 'localhost:5000'
public_users.post("/register", (req, res) => {
  const { username, password } = req.body
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

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await getAllBooks()
    res.send(JSON.stringify({ bookList }, null, 1));
  }
  catch (error) {
    res.status(500).json({ message: "Error in retrieving book list" })
  }
});

const getBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn])
      resolve(books[isbn])
    else
      reject(`No book available on ${isbn}`)
  })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params
  getBookByIsbn(isbn)
    .then((response) => {
      return res.send(response)
    })
    .catch((message) => {
      return res.status(300).json({ message: message });
    })

})

const findBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    let booksByAuthor = {}
    Object.keys(books).forEach(key => {
      if (books[key]['author'] === author) {
        booksByAuthor = books[key]
        return
      }
    })
    if (Object.keys(booksByAuthor).length < 1)
      reject("Author not found")
    else
      resolve(booksByAuthor)

  })
}
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params
  findBookByAuthor(author)
    .then((response) => res.send(response))
    .catch((message) => res.status(300).json({ message }))
});

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    let booksByTitle = {}
    Object.keys(books).forEach(key => {
      if (books[key]['title'] === title) {
        booksByTitle = books[key]
        return
      }
    })
    if (Object.keys(booksByTitle).length < 1)
      reject("Title not found")
    else
      resolve(booksByTitle)
  })
}
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params
  getBooksByTitle(title)
    .then((response) => res.send(response))
    .catch((message) => res.status(300).json({ message }))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params
  if (books[isbn])
    return res.send(books[isbn].reviews)
  else
    return res.status(300).json({ message: `No book available on ${isbn}` });
});

module.exports.general = public_users;
