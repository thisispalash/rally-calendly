import Client from './calendly';

// Reading the Calendly client params from environment variables
const base_url = process.env.CALENDLY_BASE_URL || "https://api.calendly.com";
const auth_url = process.env.CALENDLY_AUTH_URL || "https://auth.calendly.com";
const client_id = process.env.CALENDLY_CLIENT_ID;
const secret = process.env.CALENDLY_SECRET;
const callback = process.env.CALENDLY_CALLBACK;;

// API client for interacting with the Calendly API
const client = new Client(client_id, secret, auth_url, base_url, callback);

export default client;