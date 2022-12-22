exports.processRequestParams = (req, res, next) => {
  res.locals = {
    startTime: Date.now(),
    apiPath: req.url,
    method: req.method,
    params: {
      ...req.body,
      ...req.query,
      ...req.params,
    },
  };
  res.set({
    ETag: false,
    'Last-Modified': new Date().toUTCString(),
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  });
  next();
};
