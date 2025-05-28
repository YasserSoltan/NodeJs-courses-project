require("dotenv").config();
const cors = require("cors");
const httpStatusText = require("./utils/httpStatusText");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB...");
});
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

const courseRouter = require("./routes/courses.route");
const userRouter = require("./routes/users.route");
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || httpStatusText.ERROR,
    message: err.message || "Errorrr",
    data: err.data || null,
    statusCode: err.statusCode || 500,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});
