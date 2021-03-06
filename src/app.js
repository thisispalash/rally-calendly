import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';

import coreRouter from './routers/core.js';
import eventRouter from './routers/events.js';
import rallyRouter from './routers/rally.js';
import calendlyRouter from './routers/calendly.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(path.join(process.cwd(), 'src'), 'views'));
app.use('/static', express.static(path.join(path.join(process.cwd(), 'src'), 'public')));

// routes
app.use('/', coreRouter);
app.use('/rally', rallyRouter);
app.use('/events', eventRouter);
app.use('/calendly', calendlyRouter);

export default app;