const ErrRally = {
  FailRegister: new Error('Application registration failed'),
  FailAuth: new Error('User authentication failed'),
  CancelAuth: new Error('User cancelled authorization'),
  NoToken: new Error('No authorization token available')
};

const ErrCalendly = {
  FailAuth: new Error('User authentication failed'),
  FailRefresh: new Error('Failed to refresh access token'),
  ExpiredToken: new Error('Access token expired, please refresh')
};

const ErrDB = {
  Exists: new Error('Document already exists. Update instead.'),
  NotFound: new Error('Document not found with given model,key,value pair.')
};

export { ErrRally, ErrCalendly, ErrDB };