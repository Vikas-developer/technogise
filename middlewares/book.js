exports.validateBorrowReturn = (req, res, next) => {
  const { userId, bookId } = req.body;
  if (!userId || !bookId) {
    return res.status(400).json({ error: "userId and bookId are required" });
  }
  next();
};
