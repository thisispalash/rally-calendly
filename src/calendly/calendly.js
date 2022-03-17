'use strict';

const axios = require('axios');

const ErrFailAuth = new Error('User authorization failed');
const ErrFailRegister = new Error('Application registration failed');
const ErrInvalidToken = new Error('No Authorization token available');

function toConfig(headers, params) {
  let config = {};
  if (headers && Object.keys(headers).length) config.headers = headers;
  if (params && Object.keys(params).length) config.params = params;
  return config;
}

async function get_request(url, headers, params) {
  try {
    return await axios.get(url, toConfig(headers, params));
  } catch (err) {
    return err.response;
  }
}

async function post_request(url, body, headers) {
  try {
    return await axios.post(url, body, toConfig(headers));
  } catch (err) {
    console.log(err.config)
    return err.response;
  }
}

class CalendlyClient {

  constructor(client_id, secret, auth_url, base_url, callback) {
    this.client_id = client_id;
    this.secret = secret;
    this.auth_url = auth_url;
    this.base_url = base_url;
    this.callback = callback;
  }

  async authorize() {
    console.log('building calendly auth link..');
    return `${this.auth_url}/oauth/authorize?response_type=code&client_id=${this.client_id}&redirect_uri=${this.callback}`;
  }

  async tokenize(code) {
    console.log('requesting calendly access token..');
    const res = await post_request(`${this.auth_url}/oauth/token`,
      `grant_type=authorization_code&client_id=${this.client_id}&client_secret=${this.secret}&code=${code}&redirect_uri=${this.callback}`,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    );
    if (res.status == 200) {
      console.log('Calendly access token received..');
      return {
        token_type: res.data.token_type,
        created_at: res.data.created_at,
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        owner: res.data.owner.split('/').slice(-1)[0]
      };
    } else {
      console.log('User unauthenticated');
      throw ErrFailAuth;
    }
  }

  async refresh(token) {
    console.log('refreshing calendly access token..');
    const res = await post_request(`${this.auth_url}/oauth/token`,
      `grant_type=refresh_token&client_id=${this.client_id}&client_secret=${this.secret}&refresh_token=${token}`,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    );
    if (res.status == 200) {
      console.log('Calendly access token refreshed..');
      return {
        token_type: res.data.token_type,
        created_at: res.data.created_at,
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token
      };
    } else {
      console.log('Error in refreshing access token');
      throw ErrFailAuth;
    }
  }

}

module.exports = { CalendlyClient }