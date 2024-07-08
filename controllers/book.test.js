const { viewBooks, borrowBook, returnBook } = require("./book");
const bookModel = require("../models/book");

jest.mock("../models/book");

describe("Book Controller", () => {
  describe("viewBooks", () => {
    it("should get all books and return them", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockBooks = [
        { id: 1, title: "Book 1" },
        { id: 2, title: "Book 2" },
      ];
      bookModel.getBooks.mockResolvedValue(mockBooks);

      await viewBooks(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Database error");
      bookModel.getBooks.mockRejectedValue(mockError);

      await viewBooks(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });

  describe("borrowBook", () => {
    it("should allow a user to borrow a book and return a success message", async () => {
      const req = { body: { userId: 1, bookId: 1 } };
      const res = {
        json: jest.fn(),
      };
      const mockMessage = "Book borrowed successfully";
      bookModel.borrowBook.mockResolvedValue(mockMessage);

      await borrowBook(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: mockMessage });
    });

    it("should handle errors and return a 400 status with an error message", async () => {
      const req = { body: { userId: 1, bookId: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Borrow error");
      bookModel.borrowBook.mockRejectedValue(mockError);

      await borrowBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });

  describe("returnBook", () => {
    it("should allow a user to return a borrowed book and return a success message", async () => {
      const req = { body: { userId: 1, bookId: 1 } };
      const res = {
        json: jest.fn(),
      };
      const mockMessage = "Book returned successfully";
      bookModel.returnBook.mockResolvedValue(mockMessage);

      await returnBook(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: mockMessage });
    });

    it("should handle errors and return a 400 status with an error message", async () => {
      const req = { body: { userId: 1, bookId: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Return error");
      bookModel.returnBook.mockRejectedValue(mockError);

      await returnBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});
