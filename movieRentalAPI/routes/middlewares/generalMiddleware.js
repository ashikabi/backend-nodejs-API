const errors = require("../../utils/errors");

const isTokenValid = (req, res, next) =>{
  try{
    const accessToken = req.headers.authorization;
    let result;
    if(tokens.find((tk) => tk == accessToken)){//==> verify if the user is logged in
      jwt.verify(accessToken, process.env.JWT_SEED, (err, obj) => {//==> verify if the accessToken is not expired yet
          if (err) {
            return errors.sendError(codes.FORBIDDEN, res, {message: "accessToken is expired!"});
          }else
            next();// ==> user is logged in and accessToken is valid
      });
    }else{
      return errors.sendError(codes.FORBIDDEN, res, {message: "You are not a Logged in user"});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
};

const hasAdminRole = (req, res, next) =>{
  try{
    const accessToken = req.headers.authorization;
    const { user } = jwt.decode(accessToken);
    if(user.role == "ADMIN_ROLE")
      next();//==> all good, let's go to insert this movie
    else{
      //sorry bro! you are not admin...
      return errors.sendError(codes.NOT_ALLOWED, res, {message: "ADMIN ROLE is required"});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
};

const hasUserRole = (req, res, next) =>{
  try{
    const accessToken = req.headers.authorization;
    const { user } = jwt.decode(accessToken);
    if(user.role == "USER_ROLE")  
      next();//==> all good
    else{
      return errors.sendError(codes.NOT_ALLOWED, res, {message: "USER ROLE is required"});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
};

const beforeSave = (req, res, next) =>{
  try{
    const body = req.body;
    for (const [key, value] of Object.entries(body)) {
      if(typeof body[key] == "string")
        body[key] = `'${value}'`
    }
    req.body = body;
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

const getUserInSession = (req, res, next) =>{
  try{
    let accessToken = req.headers.authorization;
    const decoded = jwt.decode(accessToken);
    req.params.userId = decoded.user.id;
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

module.exports = {
                  isTokenValid,
                  hasAdminRole,
                  hasUserRole,
                  beforeSave,
                  getUserInSession
                }