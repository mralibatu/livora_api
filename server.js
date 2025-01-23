require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());  // to enable cors

app.use("/api/words", require("./controllers/word.controller"));
app.use("/api/questions", require("./controllers/question.controller"));
app.use("/api/exams", require("./controllers/exam.controller"));
app.use("/api/lists", require("./controllers/list.controller"));
app.use("/api/categories", require("./controllers/category.controller"));
app.use("/api/users", require("./controllers/user.controller"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Server listening on port " + port));