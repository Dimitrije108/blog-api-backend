require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const routes = require('./api/v1/index');

app.use(cors());
app.use(express.json());
// Parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/api/v1/auth', routes.auth);
app.use('/api/v1/users', routes.user);
app.use('/api/v1/articles', routes.article);
app.use('/api/v1/categories', routes.category);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Up and running. Over.");
});
