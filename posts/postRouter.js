const express = require('express');
const Posts = require('./postDb.js');
const mw = require('../custom/middleware.js');
const logger = mw.logger;
const validateUserId = mw.validateUserId;
const validateUser = mw.validateUser;
const validatePost = mw.validatePost;
const validatePostId = mw.validatePostId;

const router = express.Router();

router.use(logger);

router.get('/', (req, res) => {

  Posts.get()
    .then(post => {
      res.status(200).json({ post });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The Posts information could not be retrieved."
      });
    });
});

// getById(): takes an id as the argument and returns a promise that resolves to the resource with that id if found.
router.get('/:id', validatePostId, (req, res) => {
  const { id } = req.params;

  Posts.getById(id)
    .then(post => {
      res.status(200).json({ post });
    })
    .catch(err => {
      res.status(500).json({
        error: "The Posts information could not be retrieved."
      });
    });
});

// remove(): the remove method accepts an id as it's first parameter and, upon successfully 
//deleting the resource from the database, returns the number of records deleted.
router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(user => {
      res.status(200).json({message: `You deleted post ${id}`});
    })
    .catch(err => {
      res.status(500).json({message: "The post could not be removed"})
    });
});

router.put('/:id', validatePost, validatePostId, (req, res) => {
  const { id } = req.params;

  Posts.update(id, req.body)
    .then(post => {
      res.status(200).json({ success: 'Info Updated!', info: req.body })
    }) // worked on postman
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

// custom middleware


module.exports = router;
