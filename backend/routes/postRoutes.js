const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postController');

router.post('/', postsController.createPost);
router.get('/', postsController.getPosts);
router.post('/:postID/vote', postsController.votePoll);

module.exports = router;