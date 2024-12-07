const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "alex", "password": "12345678"}];

const isValid = (username)=>{ //returns boolean
  let userWithName  = users.filter((user) => {
    return user.username === username;
  });
  if(userWithName.length > 0) {
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let userWithCreds = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if(userWithCreds.length > 0) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, "secret", { expiresIn: 60 * 120 });
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  let review = req.body.review;
  if(review) {
    books[isbn].reviews[username] = review;
  res.send("Review added: " + JSON.stringify(books[isbn].reviews, null, 4));
  } else {
  res.status(403).json({ message: "Review cannot be empty"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  delete books[isbn].reviews[username];
  res.send("Review for book " + isbn + " deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
