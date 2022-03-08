const { RallyClient } = require("./rally");

// Reading the Rally client params from environment variables
const base_url = process.env.RALLY_BASE_URL || "https://api.rally.io";
const v1_url =  `${base_url}/v1`;
const api_url =  `${base_url}/api`;
const username = process.env.RALLY_USERNAME;
const password = process.env.RALLY_PASSWORD;
const callback_url = process.env.RALLY_CALLBACK;

// API client for interacting with the Rally API
const rallyClient = new RallyClient(username, password, base_url, v1_url, api_url, callback_url);

module.exports = { rallyClient };