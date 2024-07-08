const pool = require("../utils/databaseConfig");

exports.createUser = async (name) => {
  const [result] = await pool.query("INSERT INTO users (name) VALUES (?)", [
    name,
  ]);
  const { insertId: id } = result;
  return { id, name };
};

exports.getUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};
