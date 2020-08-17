/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable consistent-return */
import express from 'express';
import ip from 'ip';

const internalOnly = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // verify subnet
  if (ip.isPrivate(req.ip)) {
    // allow
    return next();
  }

  return res.sendStatus(403);
};

export default internalOnly;
