/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const Redis = require('./redis');

let FSLRedis;
let FSL_ResourceManagement_Redis;

exports.getFSLRedis = () => FSLRedis || (FSLRedis = new Redis(process.env.REDIS_URL, 24));

exports.getFSLResourceManagement = () => FSL_ResourceManagement_Redis || (FSL_ResourceManagement_Redis = new Redis(process.env.RESOURCE_MANAGEMENT_REDIS_URL, 24));

