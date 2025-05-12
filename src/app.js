require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./api/v1/index');

// Parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/auth', routes.auth);
app.use('/users', routes.user);
app.use('/articles', routes.article);
app.use('/categories', routes.category);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Up and running. Over.");
});
