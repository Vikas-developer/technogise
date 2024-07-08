const express = require("express");
const userController = require("../controllers/user");
const { validateCreateUser } = require("../middlewares/user");

const router = express.Router();

router.post("/users", validateCreateUser, userController.createUser);
router.get("/users", userController.getUsers);

module.exports = router;
