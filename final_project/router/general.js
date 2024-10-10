const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    for (const isbn in books) {
        if (isbn === req.params.isbn) {
            return res.status(200).json({message: books[isbn].title});
        }
    }
    return res.status(404).json({message: 'Book with isbn ' + req.params.isbn + 'not found'});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const found_books = [];
    for (const isbn in books) {
        const book = books[isbn];
        if (book.author === req.params.author) {
            found_books.push(book.title);
        }
    }
    if (found_books.length > 0) {
        return res.status(200).json({message: found_books.join('; ')});
    }
    return res.status(404).json({message: 'Books with author ' + req.params.author + ' not found'});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const found_books = [];
    for (const isbn in books) {
        const book = books[isbn];
        if (book.title === req.params.title) {
            found_books.push(book);
        }
    }
    if (found_books.length > 0) {
        return res.status(200).json({message: found_books});
    }
    return res.status(404).json({message: 'Books with title ' + req.params.title + ' not found'});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
