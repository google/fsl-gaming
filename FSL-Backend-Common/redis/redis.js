// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

const redis = require('redis');
const logger = require('../utils/logger');

const BUCKET_LENGTH = 3;

class Redis {
  constructor(url, expiryInHours) {
    this.url = url;
    this.expiryInHours = expiryInHours;
    this.redisClient = this.getRedisClient();
  }

  getRedisClient = () => {
    const client = redis.createClient({ url: this.url });

    client.on('connect', () => {
      logger.debug({ methodName: 'getRedisClient', message: `Connected to Redis url : ${this.url}`, resourceType: 'redis' });
    });
    client.on('error', (error) => {
      logger.error(error, { methodName: 'getRedisClient', error, resourceType: 'redis' });
    });
    client.connect();
    return client;
  }
  setRedisKey = (key, value, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const bucket = bucketVal || this.getBucketName(key);
      await this.redisClient.hSet(bucket, key, value);
      if (this.expiryInHours) {
        await this.redisClient.expire(bucket, (60 * 60 * this.expiryInHours));
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });

  getRedisKey = (key, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const bucket = bucketVal || this.getBucketName(key);
      const result = await this.redisClient.hGet(bucket, key);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

  deleteRedisKey = (key, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const bucket = bucketVal || this.getBucketName(key);
      const result = await this.redisClient.hDel(bucket, key);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

  deleteRedisBucket = bucketVal => new Promise(async (resolve, reject) => {
    try {
      const bucket = bucketVal;
      const result = await this.redisClient.del(bucket);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

  incrementRedisKey = (key, value, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const incrementedValue = await this.redisClient.hIncrBy(bucketVal, key, value);
      resolve(incrementedValue);
    } catch (error) {
      reject(error);
    }
  });

  getAllKeyValues = bucketVal => new Promise(async (resolve, reject) => {
    try {
      const result = await this.redisClient.hGetAll(bucketVal);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

  setZRedisKeyBatch = (keyvaluepairs, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const bucket = bucketVal


      await this.redisClient.multi().zAdd(bucketVal, keyvaluepairs).exec();

      if (this.expiryInHours) {
        await this.redisClient.expire(bucket, (60 * 60 * this.expiryInHours));
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
  setZRedisKey = (keyvaluepairs) => new Promise(async (resolve, reject) => {
    try {
      keyvaluepairs.forEach(async (keyvaluepair) => {
        let bucket = keyvaluepair.bucketName
        await this.redisClient.zAdd(keyvaluepair.bucketName, { score: keyvaluepair.score, value: keyvaluepair.value });
        if (this.expiryInHours) {
          await this.redisClient.expire(bucket, (60 * 60 * this.expiryInHours));
        }
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });


  deleteZRedisKey = (key, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const bucket = bucketVal || this.getBucketName(key);
      const result = await this.redisClient.ZREM(bucket, key);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });


  incrementZRedisKeyBatch = (keyvaluepairs) => new Promise(async (resolve, reject) => {
    try {
      let multi = this.redisClient.multi();
      keyvaluepairs.forEach(async keyvaluepair => {
        await this.redisClient.zIncrBy(keyvaluepair.bucketName, keyvaluepair.score, keyvaluepair.value);
      });
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
  incrementZRedisKey = (key, value, bucketVal) => new Promise(async (resolve, reject) => {
    try {
      const incrementedValue = await this.redisClient.multi().zIncrBy(bucketVal, value, key).exec();
      resolve(incrementedValue);
    } catch (error) {
      reject(error);
    }
  });
  getAllZKeyValues = bucketVal => new Promise(async (resolve, reject) => {
    try {
      const result = await this.redisClient.multi().zRangeByScoreWithScores(bucketVal,'-inf','+inf').exec();
      resolve(result.reverse());
    } catch (error) {
      reject(error);
    }
  });

  flushRedis = () => new Promise(async (resolve, reject) => {
    try {
    await this.redisClient.flushAll();
    resolve(true);
    } catch (error) {
      reject(error);
    }
  });

  clearAllCache = () => this.redisClient.flushAll();

  getBucketName = key => key.toString().substring(0, BUCKET_LENGTH)
}

module.exports = Redis;
