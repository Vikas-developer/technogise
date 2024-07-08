const express = require("express");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.use("/api", bookRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});
