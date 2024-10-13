const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
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
public_users.get('/', function (req, res) {
    let getBooks = new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve(JSON.stringify(books));
        },
        6000)
    });
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    getBooks.then((books) => {
        console.log(books);
    });
    //Console log after calling the promise
    console.log("After calling promise");
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
    for (const isbn in books) {
        if (isbn === req.params.isbn && Object.keys(books[isbn].reviews).length > 0) {
            return res.status(200).json({message: books[isbn].reviews});
        }
        else if (isbn === req.params.isbn && Object.keys(books[isbn].reviews).length === 0) {
            return res.status(200).json({message: "Book " + books[isbn].title + " does not has any reviews yet."});
        }
    }
    return res.status(404).json({message: 'Book with isbn ' + req.params.isbn + 'not found'});
});



module.exports.general = public_users;
