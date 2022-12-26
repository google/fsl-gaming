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

/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const Redis = require('./redis');

let FSLRedis;
let FSL_ResourceManagement_Redis;

exports.getFSLRedis = () => FSLRedis || (FSLRedis = new Redis(process.env.REDIS_URL, 24));

exports.getFSLResourceManagement = () => FSL_ResourceManagement_Redis || (FSL_ResourceManagement_Redis = new Redis(process.env.RESOURCE_MANAGEMENT_REDIS_URL, 24));

