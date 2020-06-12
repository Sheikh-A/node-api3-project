// 2. Build an API to let clients perform CRUD operations on users
// 3. Add endpoints to retrieve the list of posts for a user and to store a new post for a user
/*
    { name: 'Frodo Baggins' }, // 1
    { name: 'Samwise Gamgee' }, // 2
    { name: 'Meriadoc Brandybuck' }, // 3
    { name: 'Peregrin Took' }, // 4
    { name: 'Mithrandir' }, // 5
    { name: 'Boromir' }, // 6
    { name: 'Legolas' }, // 7
    { name: 'Gimli' }, // 8
    { name: 'Aragorn' }, // 9
*/

const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');
const mw = require('../custom/middleware.js');
const logger = mw.logger;
const validateUserId = mw.validateUserId;
const validateUser = mw.validateUser;
const validatePost = mw.validatePost;
//const validatePostId = mw.validatePostId;
const router = express.Router();

router.use(logger);

router.post('/', validateUser, (req, res) => {
  //console.log("Req", req.body);
  const userData = req.body;
  //console.log(userData);

  Users.insert(userData)
    .then(user => {
      res
       .status(200)
       .json({ user });
    })
    .catch(err => {
      res.status(500).json({ message: "Sorry, error occurred." });
    });
  // Users.insert(userData)
  //   .then(data => {
  //     if(userData.name) {
  //       res.status(201).json({ data });
  //     } else {
  //       res
  //         .status(400)
  //         .json({ errorMessage: "Please provide name for user" })
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).json({ 
  //       error: "There was an error while saving the post to the database"
  //      });
  //   });
});


//EASY VERSION
// router.post('/:id/posts', (req, res) => {
//   const id = req.params.id;

//   Posts.insert({ user_id: id, text: req.body.text })
//     .then(post => {
//       res.status(201).json(post)
//     })
//     .catch(error => {
//       res.status(500).json({ error: "was not able to add post to postDb" })
//     })
// });

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const { text } = req.body;
  const user_id = req.params.id;

  Users.getById(user_id)
    .then(post => {
      if (!post) { 
        null // do nothing in an if statement
      } else {
        let newPost = { // needs a regular if and else statement instead of ternary - edge case
          text, 
          user_id,
        }

        Posts.insert(newPost)
          .then(post => {
            res.status(201).json({ success: post }) // Worked on postman
        })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

// Route handler
// All array items with id & name got pulled in to Postman with GET request 
// `get()`: calling find returns a promise that resolves to an array of all the `resources` contained in the database.

router.get('/', (req, res) => {
  
  Users.get()
    .then(user => {
      // const environment = process.env;
      // const port = process.env.PORT || 5050;
      res.status(200).json({user});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The Users information could not be retrieved."
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
        res.status(200).json({ user });
    })
    .catch(err => {
      res.status(500).json({
        error: "The User information could not be retrieved."
      });
    });
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(posts => {
      if(posts) {
        res.status(200).json({ posts });
      } else {
        res.status(404).json({ error: "The post with the specified ID does not have a post or does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  
  const { id } = req.params;

  Users.remove(id)
    .then(user => {
      //if(user) {
        res.status(200).json({message: `You deleted user ${id}`});
      // } else {
      //   res
      //     .status(404)
      //     .json({ message: "The post with the specified ID does not exist." });
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The user could not be removed" });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const {id} = req.params;
  const data = req.body;

  Users.update(id, data)
    .then(item => {
      if(item && data.name) {
        res.status(200).json({ item });
      } else if (!data.name || !item) {
        res.status(400).json({ message: 'Please provide real ID and name for the user.' });
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        message:"The user information could not be modified."
      });
    });
});

//custom middleware see custom tab









module.exports = router;

/*
 {
      user_id: 1,
      text:
        'I wish the ring had never come to me. I wish none of this had happened.',
    },
    {
      user_id: 1,
      text: 'I think we should get off the road. Get off the road! Quick!',
    },
    { user_id: 1, text: 'Our business is our own.' },
    { user_id: 1, text: 'Can you protect me from yourself?' },
    { user_id: 2, text: "I ain't been droppin' no eaves, sir! Promise!" }, // 5
    { user_id: 2, text: "Of course you are, and I'm coming with you!" }, // 6
*/

