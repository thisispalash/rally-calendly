import e from "express";
import { get_request, post_request } from "../utils/axios.js";
import { ErrRally } from "../utils/errors.js";

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
    if (Date.now() > this.expiry) { this.clearAuth(); return false; }
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
      console.log(res.data)
      return true;
    } else {
      this.clearAuth();
      console.log('registration failed');
      throw ErrRally.FailRegister;
    }
  }

  refresh() {
    console.log('/refresh');
    console.log('broken API, calling `/register`');
    return this.register();
  }

  async authorize() {
    console.log('/authorize');
    if (!this.isValidToken()) throw ErrRally.NoToken; // Caller handles by calling `register()`
    const res = await post_request(`${this.v1_url}/oauth/authorize`, 
      { callback: this.callback_url }, 
      { Authorization: `${this.token_type} ${this.access_token}` }
    );
    if (res.status == 200) {
      console.log('Successfully authorized user');
      return res.data.url;
    } else {
      console.log('User unauthenticated');
      throw ErrRally.FailAuth;
    }
  }

  async userID(code) {
    console.log('/userID');
    if (!this.isValidToken()) throw ErrRally.NoToken; // Caller handles by calling `register()`
    if (code === 'cancelled') throw ErrRally.CancelAuth;
    const res = await post_request(`${this.v1_url}/oauth/userinfo`,
      { code: code },
      { Authorization: `${this.token_type} ${this.access_token}` }
    )
    if (res.status == 200) {
      console.log('User authorized application');
      return {
        userID: res.data.username,
        networkID: res.data.rnbUserId
      };
    } else {
      console.log('Callback failed');
      throw ErrRally.FailAuth;
    }
  }

  async checkCreator(user) {
    console.log(`checking if ${user} is a creator`);
    if (!this.isValidToken()) throw ErrRally.NoToken; // Caller handles by calling `register()`
    let res = await get_request(`${this.api_url}/creator-coins`,
      { Authorization: `${this.token_type} ${this.access_token}` },
      { size: 50 }
    );
    let lastKey = res.headers['last-evaluated-key'];
    while (lastKey !== undefined) {
      let data = res.data;
      data.forEach((elem) => {
        if (elem.creatorAccountId == user) return elem.symbol;
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

  nfts(token) {
    if (!this.isValidToken()) throw ErrRally.NoToken; // Caller handles by calling `register()`
    let res = await get_request(`${this.api_url}/nft-templates`,
      { Authorization: `${this.token_type} ${this.access_token}` },
      { creatorCoinSymbol: token, size: 50 }
    );
    if (res.status == 200) {
      let data = [];
      res.data.forEach( (nft) => {
        data.push({ id: nft.id, title: nft.title });
      });
      let lastKey = res.headers['last-evaluated-key'];
      while(lastKey !== undefined) {
        res = await get_request(`${this.api_url}/nft-templates`,
          { Authorization: `${this.token_type} ${this.access_token}` },
          { creatorCoinSymbol: token, size: 50 , startKey: lastKey }
        );
        res.data.forEach( (nft) => {
          data.push({ id: nft.id, title: nft.title });
        });
      }
      return { data: data };
    } else {
      console.log('Error fetching nft templates');
      return {}
    }
  }

  nfts(networkID, nftID) {

  }

}

export default RallyClient;