"use strict";

const express = require('express');
const cors = require('cors');
const auth = require('./routes/auth');
const { NotFoundError } = require('./expressError');

const { NODE_ENV } = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', auth);

/** Handle 404 errors */
app.use((req, res, next) => {
  return next(new NotFoundError());
});


/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
  if (NODE_ENV !== "test") console.log(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
