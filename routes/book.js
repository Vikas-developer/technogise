const express = require("express");
const bookController = require("../controllers/book");
const { validateBorrowReturn } = require("../middlewares/book");

const router = express.Router();

router.get("/books", bookController.viewBooks);
router.get("/books/:userId", bookController.viewBorrowedBooks);
router.post("/books/borrow", validateBorrowReturn, bookController.borrowBook);
router.post("/books/return", validateBorrowReturn, bookController.returnBook);

module.exports = router;
