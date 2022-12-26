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



const logger = require('../utils/logger');


const envVariables = [
  'NODE_ENV',
  'PORT'
];

exports.checkEnvVariables = () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    envVariables.forEach((each) => {
      if (!process.env[each]) {
        logger.error(`${each} not set!`, {
          methodName: 'checkEnvVariables',
          resourceType: 'environmentCheck',
        });
      } else {
        logger.debug({
          [each]: process.env[each],
          methodName: 'checkEnvVariables',
          resourceType: 'environmentCheck',
        });
      }
    });
    return;
  } catch (error) {
    logger.error(error, { methodName: 'checkEnvVariables', error, resourceType: 'environmentCheck' });
  }
};
