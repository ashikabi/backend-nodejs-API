
const getNotFound = (param) => {
  return {
    error: {
      code: codes.NOT_FOUND,
      type: "Not Found",
      message: param.message,
      description: "Not In Database"
  }
  };
}

const getMissingArguments = (param) => {
  return {
    error: {
      code: codes.BAD_REQUEST,
      type: "Missing Arguments",
      message: param.message,
      description: "One or more argument is missing"
  }
  };
}

const getNotAllowed = (param) => {
  return {
    error: {
      code: codes.NOT_ALLOWED,
      type: "Not Allowed",
      message: param.message,
      description: "Not allowed with the current value"
  }
  };
}

const getForbidden = (param) => {
  return {
    error: {
      code: codes.FORBIDDEN,
      type: "Forbidden Access",
      message: param.message,
      description: "AccessToken has expired or you are not a logged in user"
  }
  };
}

const getUnsupported = (param) => {
  return {
    error: {
      code: codes.UNSUPPORTED,
      type: "Unsupported Request",
      message: param.message,
      description: "Request can't be processed"
  }
  };
}

const getUnprocessable = (param) => {
  return {
    error: {
      code: codes.UNPROCESSABLE,
      type: "Unprocessable Request",
      message: "Internal Error",
      description: param.message
  }
  };
};

const catchError = (res,err) =>{
  let result = getUnprocessable({message : err.message});
  return res
            .status(result.error.code)
            .json(result);
};

const sendError = (type, res, param) =>{
  let result;

  switch(type){
    case codes.NOT_FOUND:
      result = getNotFound(param);
      break;
    case codes.BAD_REQUEST:
      result = getMissingArguments(param);
      break;
    case codes.NOT_ALLOWED:
      result = getNotAllowed(param);
      break;
    case codes.FORBIDDEN:
      result = getForbidden(param);
      break;
    case codes.UNSUPPORTED:
      result = getUnsupported(param);
      break;
    default://UNPROCESSABLE
    result = getUnprocessable(param);
  };

  return res
            .status(result.error.code)
            .json(result);
};

module.exports = { 
                   catchError,
                   sendError 
                  }