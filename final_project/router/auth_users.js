const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
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
            data: {'username': username}
        }, 'access', { expiresIn: 60 * 60 });
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
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const review = req.body.review;
        const username = req.user.data.username;
        if (review) {
            book.reviews[username] = req.body.review;
            book.reviews[username];
            res.send('Review for isbn ' + isbn + ' and user ' + username + ' added.');
        }
        else { 
            res.send('The review property is required.');
        }
    } else {
        res.send("Unable to find book with isbn "+isbn+"!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const username = req.user.data.username;
        if (book.reviews[username].length > 0) {
            delete book.reviews[username];
            res.send('Review for isbn ' + isbn + ' and user ' + username + ' has been deleted.');
        }
        else {
            res.send('Review for isbn ' + isbn + ' and user ' + username + ' not found.');
        }
    } else {
        res.send("Unable to find book with isbn " + isbn + "!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
