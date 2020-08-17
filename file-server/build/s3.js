"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// let endpoint: AWS.Endpoint;
let s3;
const init = () => {
    const endpointString = process.env.S3_ENDPOINT;
    if ((endpointString === null || endpointString === void 0 ? void 0 : endpointString.length) === 0) {
        console.error('No S3 endpoint variable set');
        process.exit(1);
    }
    s3 = new aws_sdk_1.default.S3({
        endpoint: endpointString,
    });
    return s3;
};
const singleton = () => {
    if (s3 === null) {
        init();
    }
    return s3;
};
exports.default = singleton();
