require('dotenv').config();
const express = require('express');
const app = express();

const indexRouter = require('./routes/indexRouter');

// Parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Up and running. Over.");
});
