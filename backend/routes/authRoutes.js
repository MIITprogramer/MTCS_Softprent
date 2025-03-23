const express = require("express");
const router = express.Router();
const controller = require('../controllers/authController')

router.post('/login', controller.login)
router.post('/addrole', controller.addRole)
router.post('/getroles', controller.getRoles)
router.post('/editrole', controller.editRole)
router.post('/deleterole', controller.deleteRole)
router.post('/adduser', controller.addUser)
router.post('/getusers', controller.getUser)
router.post('/edituser', controller.editUser)
router.post('/deleteUser', controller.deleteUser)
router.post('/changepass', controller.changePass)
router.post('/gethome', controller.getHome)

module.exports = router