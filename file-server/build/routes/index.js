"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const s3_1 = __importDefault(require("../s3"));
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        health: 'healthy',
        version: '0.0.1',
    });
});
router.get('/buckets', (req, res) => {
    s3_1.default.listBuckets((err, data) => {
        if (err) {
            res.json({
                status: 'error',
                reason: err,
            });
        }
        else {
            res.json({
                status: 'ok',
                data,
            });
        }
    });
});
exports.default = router;
