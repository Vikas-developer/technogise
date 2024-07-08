const bookModel = require("../models/book");

exports.viewBooks = async (req, res) => {
  try {
    const books = await bookModel.getBooks();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  const { body } = req;
  const { userId, bookId } = body;
  try {
    const message = await bookModel.borrowBook(userId, bookId);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  const { body } = req;
  const { userId, bookId } = body;
  try {
    const message = await bookModel.returnBook(userId, bookId);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
