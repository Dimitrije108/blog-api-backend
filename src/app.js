require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./api/v1/routes');

// Parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/auth', router.auth);
app.use('/users', router.user);
app.use('/articles', router.article);
app.use('/categories', router.category);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Up and running. Over.");
});
