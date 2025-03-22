const express = require("express");
const router = express.Router();
const controller = require('../controllers/toolController.js');

router.post('/', controller.getTools)
router.post('/add', controller.addTool)
router.post('/edit', controller.editTool)
router.post('/delete', controller.deleteTool)

module.exports = router