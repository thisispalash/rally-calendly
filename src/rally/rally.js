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
    return err.response;
  }
}

class RallyClient {

  constructor(username, password, base_url, v1_url, api_url, callback_url) {
    this.username = username;
    this.password = password;
    this.base_url = base_url;
    this.v1_url = v1_url;
    this.api_url = api_url;
    this.callback_url = callback_url;
    this.clearAuth();
  }

  setAuth(data) {
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    this.token_type = data.token_type;
    this.expiry = Date.now() + data.expires_in * 1000;
  }

  clearAuth() {
    this.access_token = undefined;
    this.refresh_token = undefined;
    this.token_type = undefined;
    this.expiry = undefined;
  }

  isValidToken() {
    if (!this.access_token) return false;
    if (Date.now() > this.expiry) return false;
    return true;
  }

  async register() {
    console.log('/register');
    const res = await post_request( `${this.v1_url}/oauth/register`, {
      username: this.username,
      password: this.password
    });
    if (res.status == 200) {
      this.setAuth(res.data);
      console.log('successfully registered');
      return true;
    } else {
      this.clearAuth();
      console.log('registration failed');
      throw ErrFailRegister;
    }
  }

  refresh() {
    console.log('/refresh');
    console.log('broken API, calling `/register`');
    return this.register();
  }

  async authorize() {
    console.log('/authorize');
    if (!this.isValidToken()) throw ErrInvalidToken; // Caller handles by calling `register()`
    const res = await post_request(`${this.v1_url}/oauth/authorize`, 
      { callback: this.callback_url }, 
      { Authorization: `${this.token_type} ${this.access_token}` }
    );
    if (res.status == 200) {
      console.log('Successfully authorized user');
      return res.data.url;
    } else {
      console.log('User unauthenticated');
      throw ErrFailAuth;
    }
  }

  async userID(code) {
    console.log('/userID');
    if (!this.isValidToken()) throw ErrInvalidToken; // Caller handles by calling `register()`
    if (code === 'cancelled') throw ErrFailAuth;
    const res = await post_request(`${this.v1_url}/oauth/userinfo`,
      { code: code },
      { Authorization: `${this.token_type} ${this.access_token}` }
    )
    if (res.status == 200) {
      console.log('User authorized application');
      return res.data;
    } else {
      console.log('Callback failed');
      throw ErrFailAuth;
    }
  }

  async checkCreator(user) {
    console.log(`checking if ${user} is a creator`);
    if (!this.isValidToken()) throw ErrInvalidToken; // Caller handles by calling `register()`
    let res = await get_request(`${this.api_url}/creator-coins`,
      { Authorization: `${this.token_type} ${this.access_token}` },
      { size: 50 }
    );
    let lastKey = res.headers['last-evaluated-key'];
    while (lastKey !== undefined) {
      let data = res.data;
      data.forEach((elem) => {
        if (elem.creatorAccountId == user) return true;
      });
      res = await get_request(`${this.api_url}/creator-coins`,
        { Authorization: `${this.token_type} ${this.access_token}` },
        { startKey: lastKey, size: 50 }
      );
      lastKey = res.headers['last-evaluated-key'];
    }
    return false;
  }

  balance(token) {

  }

}

module.exports = { RallyClient }