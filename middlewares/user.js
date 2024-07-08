exports.validateCreateUser = (req, res, next) => {
  const { body } = req;
  const { name } = body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  next();
};
