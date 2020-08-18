import express from 'express';

import internal from '../middleware/internal';
import s3 from '../s3';

const router = express.Router();

router.use(internal);

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    health: 'healthy',
    version: '0.0.1',
  });
});

router.get('/ip', (req, res) => {
  res.json({
    status: 'ok',
    ips: req.ips,
  });
});

router.get('/buckets', (req, res) => {
  s3.listBuckets((err, data) => {
    if (err) {
      res.json({
        status: 'error',
        reason: err,
      });
    } else {
      res.json({
        status: 'ok',
        data,
      });
    }
  });
});

router.get('/config', (req, res) => {
  res.json({
    status: 'ok',
    config: {
      ...s3.config,
      credentials: null,
      credentialProvider: null,
    },
  });
});

export default router;
