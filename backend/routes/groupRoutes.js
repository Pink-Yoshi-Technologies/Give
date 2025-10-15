const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupController");

router.post("/", groupsController.createGroup);
router.get("/", groupsController.getGroups);
router.post("/join", groupsController.joinGroup);

module.exports = router;
