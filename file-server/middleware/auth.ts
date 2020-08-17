/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable consistent-return */
import express from 'express';
import jwt from 'jsonwebtoken';

interface User {
  id: string,
  email: string,
}

declare module 'express' {
  export interface Request {
    user?: User,
  }
}

const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, <string>process.env.JWT_SECRET_KEY, (err: unknown, user: unknown) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.user = <User>user;
    next();
  });
};

export default authenticateToken;
