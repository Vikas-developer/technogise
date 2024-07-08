const pool = require("../utils/databaseConfig");

exports.getBooks = async () => {
  const [rows] = await pool.query("SELECT * FROM books");
  return rows;
};

exports.borrowBook = async (userId, bookId) => {
  const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);
  if (userRows.length === 0) {
    throw new Error("User not found");
  }

  const [bookRows] = await pool.query("SELECT * FROM books WHERE id = ?", [
    bookId,
  ]);
  if (bookRows.length === 0) {
    throw new Error("Book not found");
  }

  const [borrowedBooksCount] = await pool.query(
    "SELECT COUNT(*) as count FROM borrowed_books WHERE user_id = ?",
    [userId]
  );
  if (borrowedBooksCount[0].count >= 2) {
    throw new Error("Borrow limit reached");
  }

  const [alreadyBorrowed] = await pool.query(
    "SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ?",
    [userId, bookId]
  );
  if (alreadyBorrowed.length > 0) {
    throw new Error("User already borrowed this book");
  }
  if (bookRows[0].copies < 1) {
    throw new Error("No copies left to borrow");
  }

  await pool.query(
    "INSERT INTO borrowed_books (user_id, book_id) VALUES (?, ?)",
    [userId, bookId]
  );
  await pool.query("UPDATE books SET copies = copies - 1 WHERE id = ?", [
    bookId,
  ]);
  return "Book borrowed successfully";
};

exports.returnBook = async (userId, bookId) => {
  const [borrowedBook] = await pool.query(
    "SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ?",
    [userId, bookId]
  );
  if (borrowedBook.length === 0) {
    throw new Error("Book not found in borrowed list");
  }

  await pool.query(
    "DELETE FROM borrowed_books WHERE user_id = ? AND book_id = ?",
    [userId, bookId]
  );
  await pool.query("UPDATE books SET copies = copies + 1 WHERE id = ?", [
    bookId,
  ]);
  return "Book returned successfully";
};
