require('@google-cloud/trace-agent').start({
    plugins: { redis: '' },
    keyFilename: `../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`,
});
