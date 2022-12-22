const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/ContestBusiness');

exports.createContest = (req, res) => {
  businesslogic
    .createContest(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.updateWinnersList = (req, res) => {
  businesslogic
    .updateWinnersList(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};


exports.createPlaying11 = (req, res) => {
  businesslogic
    .createPlaying11(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getAllContests = (req, res) => {
  businesslogic
    .getAllContests()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestbyID = (req, res) => {
  businesslogic
    .getContestbyID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestResultbyID = (req, res) => {
  businesslogic
    .getContestResultbyID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestsByMatchID = (req, res) => {
  businesslogic
    .getContestsByMatchID(req.swagger.params.matchid.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestsByActiveStatus = (req, res) => {
  businesslogic
    .getContestsByActiveStatus()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};


exports.getContestsByScheduledStatus = (req, res) => {
  businesslogic
    .getContestsByScheduledStatus()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestsByCompletedStatus = (req, res) => {
  businesslogic
    .getContestsByCompletedStatus()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.updateContest = (req, res) => {
  businesslogic
    .updateContest(req.swagger.params.id.value, req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
