require("dotenv").config();
require("../config/passport");
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const app = express();
const routes = require("./api/v1/index");
const prismaErrorHandler = require("./middleware/prismaErrorHandler");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
// Parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use("/api/v1/auth", routes.auth);
app.use("/api/v1/users", routes.user);
app.use("/api/v1/articles", routes.article);
app.use("/api/v1/categories", routes.category);
app.use("/api/v1/comments", routes.comment);
app.use("/api/v1/dashboard", routes.dashboard);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});
app.use(prismaErrorHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Up and running. Over.");
});
