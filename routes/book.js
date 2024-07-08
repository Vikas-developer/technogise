const express = require("express");
const bookController = require("../controllers/book");

const router = express.Router();

router.get("/books", bookController.viewBooks);
router.post("/books/borrow", bookController.borrowBook);
router.post("/books/return", bookController.returnBook);

module.exports = router;
