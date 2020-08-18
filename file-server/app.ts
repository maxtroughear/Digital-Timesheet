import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import avatarRouter from './routes/avatar';

const port = process.env.PORT || 3000;

const app = express();

app.set('trust proxy', 'loopback, linklocal, uniquelocal');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/avatars', avatarRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  res.json({
    status: 'error',
    reason: 'unknown route',
  });

  next();
});

app.use((req) => {
  // log the error
  console.log(req.ip);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

module.exports = app;
