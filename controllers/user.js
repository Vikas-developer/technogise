const userModel = require("../models/user");

exports.createUser = async (req, res) => {
  try {
    const { body } = req;
    const { name } = body;
    const user = await userModel.createUser(name);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
