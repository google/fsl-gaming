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

const scheduler = require('@google-cloud/scheduler');

// Create a client.



exports.cloudJobScheduler=async (params)=> {
    const client = new scheduler.CloudSchedulerClient();
    req=JSON.stringify(params);
    const parent = client.locationPath(process.env.PROJECT_ID,
        "asia-south1"
         );
    const job = {
        httpTarget: {
          uri: params.url,
          httpMethod: params.method,
          body: Buffer.from(JSON.stringify(params.body)),
        },
        schedule: '2 * * * *',
        timeZone: 'IST',
      }; 
      const request = {
        parent: parent,
        job: job,
      };
      
      // Use the client to send the job creation request.
      const [response] = await client.createJob(request);
      return response;
};