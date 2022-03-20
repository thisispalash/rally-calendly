import axios from 'axios';

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

export { get_request, post_request };