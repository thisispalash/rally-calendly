import e from "express";
import { get_request, post_request } from "../utils/axios.js";
import { ErrCalendly } from "../utils/errors.js";

class CalendlyClient {

  constructor(client_id, secret, auth_url, base_url, callback) {
    this.client_id = client_id;
    this.secret = secret;
    this.auth_url = auth_url;
    this.base_url = base_url;
    this.callback = callback;
  }

  authorize() {
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
      let data = {};
      data.token_type = res.data.token_type;
      // provided in seconds, not miliseconds
      data.created_at = new Date(res.data.created_at * 1000);
      data.expires_at = new Date((res.data.created_at + res.data.expires_in) * 1000);
      data.access_token = res.data.access_token;
      data.refresh_token = res.data.refresh_token;
      data.owner = res.data.owner.split('/').slice(-1)[0];
      return data;
    } else {
      console.log('User unauthenticated');
      throw ErrCalendly.FailAuth;
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
      let data = {};
      data.token_type = res.data.token_type;
      data.created_at = new Date(res.data.created_at);
      data.expires_at = new Date(res.data.created_at + res.data.expires_in * 1000);
      data.access_token = res.data.access_token;
      data.refresh_token = res.data.refresh_token;
      return data;
    } else {
      console.log('Error in refreshing access token');
      throw ErrCalendly.FailRefresh;
    }
  }

  async isValidToken(token) {
    console.log('Introspecting access token..');
    const res = await post_request(`${this.auth_url}/oauth/introspect`,
      `client_id=${this.client_id}&client_secret=${this.secret}&token=${token}`,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    );
    return res.data.active;
  }
  
  async getUser(token_type, token, uuid) {
    if (!this.isValidToken) throw ErrCalendly.ExpiredToken;
    const res = await get_request(`${this.base_url}/users/${uuid}`,
      { 'Authorization': `${token_type} ${token}`}
    );
    if (res.status == 200) {
      let data = {};
      data.owner = res.data.resource.uri.split('/').slice(-1)[0];
      data.name = res.data.resource.name;
      data.slug = res.data.resource.slug;
      return data;
    } else {
      console.log('Error in fetching user');
      return {}
    }
  }

  async getEvents(token_type, token, uuid) {
    if (!this.isValidToken) throw ErrCalendly.ExpiredToken;
    // TODO turn into `do=while`
    let res = await get_request(`${this.base_url}/event_types`,
      { 'Authorization': `${token_type} ${token}`},
      { active: true, user: `${this.base_url}/users/${uuid}`, count: 100 }
    );
    if (res.status == 200) {
      let data = [];
      res.data.collection.forEach( (event) => {
        if (!event.active) return;
        data.push({ 
          uri: event.uri.split('/').slice(-1)[0],
          name: event.name
        });
      });
      while (res.data.pagination.next_page) {
        res = await get_request(res.data.pagination.next_page);
        res.data.collection.forEach( (event) => {
          if (!event.active) return;
          data.push({ 
            uri: event.uri.split('/').slice(-1)[0],
            name: event.name
          });
        });
      }
      return data;
    } else {
      console.log('Error in fetching event types');
      return [];
    }
  }

  async getSchedulingLink(token_type, token, event) {
    if (!this.isValidToken) throw ErrCalendly.ExpiredToken;
    let res = await post_request(`${this.base_url}/scheduling_links`, 
      { max_event_count: 1, owner_type: 'EventType', owner: `${this.base_url}/event_types/${event}`},
      { 'Authorization': `${token_type} ${token}`}
    );
    if (res.status == 201) {
      return res.data.resource.booking_url;
    } else {
      console.log('Error in getting single schedule link');
      console.log(res.data);
      return undefined;
    }
  }

}

export default CalendlyClient;