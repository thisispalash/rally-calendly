import 'dotenv/config';
import Calendly from './calendly.js';
import Rally from './rally.js';

// Reading the Rally client params from environment variables
const base_url = process.env.RALLY_BASE_URL || "https://api.rally.io";
const v1_url =  `${base_url}/v1`;
const api_url =  `${base_url}/api`;
const username = process.env.RALLY_USERNAME;
const password = process.env.RALLY_PASSWORD;
const callback_url = process.env.RALLY_CALLBACK;

// API client for interacting with the Rally API
export const RallyClient = new Rally(username, password, base_url, v1_url, api_url, callback_url);

// Reading the Calendly client params from environment variables
const calendly_base = process.env.CALENDLY_BASE_URL || "https://api.calendly.com";
const auth_url = process.env.CALENDLY_AUTH_URL || "https://auth.calendly.com";
const client_id = process.env.CALENDLY_CLIENT_ID;
const secret = process.env.CALENDLY_SECRET;
const callback = process.env.CALENDLY_CALLBACK;;

// API client for interacting with the Calendly API
export const CalendlyClient = new Calendly(client_id, secret, auth_url, calendly_base, callback);