const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let p = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });
  p.then();
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let p = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    resolve(res.send(JSON.stringify(books[isbn], null, 4)));
  });
  p.then();
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let p = new Promise((resolve, reject) => { 
    const author = req.params.author.toLowerCase();
    let matches = {};
    for(isbn in books) {
      let book = books[isbn];
      if(book.author.toLowerCase().includes(author)) {
        matches[isbn]=book;
      }
    }
    res.send(JSON.stringify(matches, null, 4));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let p = new Promise((resolve, reject) => { 
    const title = req.params.title.toLowerCase();
    let matches = {};
    for(isbn in books) {
      let book = books[isbn];
      if(book.title.toLowerCase().includes(title)) {
        matches[isbn]=book;
      }
    }
    res.send(JSON.stringify(matches, null, 4));
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
