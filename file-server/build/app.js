"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const s3_1 = __importDefault(require("./s3"));
const index_1 = __importDefault(require("./routes/index"));
const avatar_1 = __importDefault(require("./routes/avatar"));
s3_1.default.listBuckets((err, data) => {
    if (err) {
        console.log('Error', err);
    }
    else {
        console.log('Success', data.Buckets);
    }
});
const port = process.env.PORT || 3000;
const app = express_1.default();
app.set('trust proxy', 1);
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use('/', index_1.default);
app.use('/avatars', avatar_1.default);
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
