"use strict";

require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const github_client_id = process.env.GITHUB_CLIENT_ID
const github_redirect_uri = process.env.GITHUB_REDIRECT_URI;
const github_client_secret = process.env.GITHUB_CLIENT_SECRET;
const dbName = process.env.MONGO_DB_NAME;
const secretJwt = process.env.SECRET_JWT;
const clientUrl = process.env.CLIENT_URL;

module.exports = {
  NODE_ENV,
  github_client_id,
  github_redirect_uri,
  github_client_secret,
  dbName,
  secretJwt,
  clientUrl
};
