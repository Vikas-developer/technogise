const pool = require("../utils/databaseConfig");
const bookModel = require("./book");

jest.mock("../utils/databaseConfig");

describe("Book Model", () => {
  describe("getBooks", () => {
    it("should get all books and return them", async () => {
      const mockRows = [
        { id: 1, title: "Book 1" },
        { id: 2, title: "Book 2" },
      ];
      pool.query.mockResolvedValue([mockRows]);

      const books = await bookModel.getBooks();
      expect(books).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM books");
    });

    it("should handle errors", async () => {
      const mockError = new Error("Database error");
      pool.query.mockRejectedValue(mockError);

      await expect(bookModel.getBooks()).rejects.toThrow("Database error");
    });
  });

  describe("getBorrowedBooks", () => {
    it("should get all borrowed books for a user and return them", async () => {
      const userId = 1;
      const mockRows = [
        { id: 1, name: "Book 1" },
        { id: 2, name: "Book 2" },
      ];
      pool.query.mockResolvedValue([mockRows]);

      const borrowedBooks = await bookModel.getBorrowedBooks(userId);
      expect(borrowedBooks).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT borrowed_books.book_id as id, books.name FROM borrowed_books join books on borrowed_books.book_id=books.id where borrowed_books.user_id = ?",
        [userId]
      );
    });

    it("should handle errors", async () => {
      const userId = 1;
      const mockError = new Error("Database error");
      pool.query.mockRejectedValue(mockError);

      await expect(bookModel.getBorrowedBooks(userId)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("borrowBook", () => {
    it("should allow a user to borrow a book if all conditions are met", async () => {
      const userId = 1;
      const bookId = 1;
      const mockUserRows = [{ id: 1, name: "John Doe" }];
      const mockBookRows = [{ id: 1, title: "Book 1", copies: 1 }];
      const mockBorrowedBooksCount = [{ count: 1 }];
      const mockAlreadyBorrowed = [];
      pool.query
        .mockResolvedValueOnce([mockUserRows])
        .mockResolvedValueOnce([mockBookRows])
        .mockResolvedValueOnce([mockBorrowedBooksCount])
        .mockResolvedValueOnce([mockAlreadyBorrowed])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await bookModel.borrowBook(userId, bookId);
      expect(result).toBe("Book borrowed successfully");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM books WHERE id = ?",
        [bookId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) as count FROM borrowed_books WHERE user_id = ?",
        [userId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO borrowed_books (user_id, book_id) VALUES (?, ?)",
        [userId, bookId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE books SET copies = copies - 1 WHERE id = ?",
        [bookId]
      );
    });

    it("should throw an error if the user is not found", async () => {
      const userId = 1;
      const bookId = 1;
      const mockUserRows = [];
      pool.query.mockResolvedValueOnce([mockUserRows]);

      await expect(bookModel.borrowBook(userId, bookId)).rejects.toThrow(
        "User not found"
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );
    });
  });

  describe("returnBook", () => {
    it("should allow a user to return a borrowed book if all conditions are met", async () => {
      const userId = 1;
      const bookId = 1;
      const mockBorrowedBook = [{ user_id: 1, book_id: 1 }];
      pool.query
        .mockResolvedValueOnce([mockBorrowedBook])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await bookModel.returnBook(userId, bookId);
      expect(result).toBe("Book returned successfully");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM borrowed_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE books SET copies = copies + 1 WHERE id = ?",
        [bookId]
      );
    });

    it("should throw an error if the book is not found in the borrowed list", async () => {
      const userId = 1;
      const bookId = 1;
      const mockBorrowedBook = [];
      pool.query.mockResolvedValueOnce([mockBorrowedBook]);

      await expect(bookModel.returnBook(userId, bookId)).rejects.toThrow(
        "Book not found in borrowed list"
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM borrowed_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
    });
  });
});
