const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postController');

router.post('/', postsController.createPost);
router.get('/', postsController.getPosts);

module.exports = router;