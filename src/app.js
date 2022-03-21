import express from 'express';
import path from 'path';

import coreRouter from './routers/core';
import rallyRouter from './routers/rally';
import calendlyRouter from './routers/calendly';

const app = express();

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')));

// routes
app.use('/', coreRouter);
app.use('/rally', rallyRouter);
app.use('/calendly', calendlyRouter);

export default app;