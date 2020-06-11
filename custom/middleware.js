// MVP
// 1. Write and implement four custom middleware functions
// 2. Build an API to let clients perform CRUD operations on users
// 3. Add endpoints to retrieve the list of posts for a user and to store a new post for a user

// For validations (400 errors) in the mw

const Users = require('../users/userDb');
const Posts = require('../posts/postDb');

/*
  1. `logger()`
    - `logger` logs to the console the following information about each request: request method, request url, and a timestamp
    - this middleware runs on every request made to the API
*/

function logger(req, res, next) {
    const method = req.method;
    const endpoint = req.originalUrl;
    const dates = [new Date().toISOString()];  
    //can also use new Date();
    console.log(`Date: ${dates} Req.method, ${method} to ${endpoint} , Req.originalUrl `);
    
    next();
  }

/*
 2. `validateUserId()`
  - `validateUserId` validates the user id on every request that expects a user id parameter
  - if the `id` parameter is valid, store that user object as `req.user`
  - if the `id` parameter does not match any user id in the database, cancel the request and respond with status `400` and `{ message: "invalid user id" }`
*/

function validateUserId(req, res, next) {
    const { id } = req.params;
  
    Users.getById(id)
      .then(user => {
        if(user) {
          req.user = user;
          next();
        } else {
          res.status(400).json({ message: "Invalid user ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "failed" });
      });
  }

function validateUser(req, res, next) {
    const userData = req.body;

    if(userData === {}) {
        res.status(400).json({ message: "missing user data" });
    } else if( !userData.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        next();
    }
  }

function validatePost(req, res, next) {
    const body = req.body;
    body.user_id = req.params.id;

    if(body === {}) {
        res.status(400).json({ message: "missing post data" });
    } else if ( !body.text) {
        res.status(400).json({ message: "missing required text field" });
    } else {
        next();
    }
  }

function validatePostId (req, res, next) {
    const { id } = req.params;

    Posts.getById(id)
      .then(user => {
          if(user) {
              req.user = user
              next();
          } else if (!user) {
              res.status(400).json({ message: 'Invalid User ID!' });
          } else {
              next();
          }
      })
}



module.exports = {
    logger,
    validateUserId,
    validateUser,
    validatePost,
    validatePostId
}