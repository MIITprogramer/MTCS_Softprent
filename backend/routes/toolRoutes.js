const express = require("express");
const router = express.Router();
const controller = require('../controllers/toolController.js');

router.post('/', controller.getTools)
router.post('/add', controller.addTool)
router.post('/edit', controller.editTool)
router.post('/delete', controller.deleteTool)
router.post('/data', controller.getData)
router.post('/updatedata', controller.updateData)
router.post('/getcollumn', controller.getColumn)
router.post('/dailycheckinit', controller.dailyCheckInit)
router.post('/getimage', controller.reqImage)
router.post('/dailychecksubmit', controller.dailychecksubmit)

module.exports = router