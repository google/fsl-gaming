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