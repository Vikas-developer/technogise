const express = require("express");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/book");
const libraryRoutes = require("./routes/library");
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use("/api", bookRoutes);
app.use("/api", libraryRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});
