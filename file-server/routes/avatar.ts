import express from 'express';

import auth from '../middleware/auth';
import s3 from '../s3';

const router = express.Router();

router.use(auth);

/* GET users listing. */
router.get('/', (req, res) => {
  res.json({
    message: 'Other route',
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

router.post('/upload', (req, res) => {

});

export default router;
