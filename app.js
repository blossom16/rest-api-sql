'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/routes');
const { sequelize } = require('./models')

// Create the Express app
const app = express();

// Tests the database connection
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

// Configures middleware
app.use(express.json());
app.use(morgan('dev'));
app.use("/api", routes);

// Root route greeting
app.get('/', (req, res) => {
  res.json('Welcome to the REST API project!');
});

// 404 error handling
app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Route not found' });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Port
app.set('port', process.env.PORT || 5000);

// Start the server
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
