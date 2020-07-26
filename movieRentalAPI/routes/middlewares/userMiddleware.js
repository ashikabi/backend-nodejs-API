const user = require("../../db/models/userModel");
const errors = require("../../utils/errors");

const loginMiddleware = async(req, res, next) =>{
  try{
    let result;
    if(!req.body.email || !req.body.password){
      return errors.sendError(codes.BAD_REQUEST, res, {message: ["email","password"]});
    }
  
    result = await user.findOne({email : req.body.email, status: 'A'});
    if(!result){
      return errors.sendError(codes.NOT_FOUND, res, {message: req.body.email});
    }
    
    if(req.body.password != result.password){
      return errors.sendError(codes.NOT_ALLOWED, res, {message: "Invalid Password"});
    }
    res.result = result;
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

const logoutMiddleware = (req, res, next) =>{
  try{
    const accessToken = req.headers.authorization;

    if(tokens.find((tk) => tk == accessToken)){
      jwt.verify(accessToken, process.env.JWT_SEED, (err, obj) => {
          if (err) {
            return errors.sendError(codes.FORBIDDEN, res, {message: "accessToken is expired!"});
          }else{
            tokens = tokens.filter((tk) => tk != accessToken );
            next();
          }
      });
    }else{
      return errors.sendError(codes.FORBIDDEN, res, {message: "You are not a Logged in user"});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
};

const beforeSendEmail = async(req, res, next) =>{
  try{
    let result;
    if(!req.body.email){
      return errors.sendError(codes.BAD_REQUEST, res, {message: "email is required"});
    }
  
    result = await user.findOne({email : req.body.email});
    if(!result){
      return errors.sendError(codes.NOT_FOUND, res, {message: req.body.email});
    }
    result.password
    req.body.user = result;
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

const sendEmailTo = (options) =>{
  try{
    return new Promise((resolve,reject) => {
      const mailDetails = { 
        from: `"Movie Rental API" <${process.env.SMTP_USER}>`, 
        to: options.to
      }; 

      if(options.type == "RECOVERY"){
        mailDetails.subject = "Recovery Password";
        mailDetails.text = `Your Password is : ${options.password}`;
      }
      if(options.type == "CONFIRM"){
        mailDetails.subject = "Confirm Account";
        mailDetails.html = `<p>Click <a href="http://localhost:9001/confirm?accessToken=${options.accessToken}">here</a> to confirm your account.</p>`;
      }

      mailTransporter.sendMail(mailDetails, (err, data)=> { 
                      if(err)
                        reject(err);
                      else 
                        resolve(data);
      }); 
    }); 
  }catch(e){
    return errors.catchError(res,e);
  }
};

const beforeRegister = async(req, res, next) =>{
  try{
    let result;
    if(!req.body.email || !req.body.password){
      return errors.sendError(codes.BAD_REQUEST, res, {message: ["email","password"]});
    }
  
    result = await user.findOne({email : req.body.email});
    if(result)
      return errors.sendError(codes.CREATED, res, {message: "There is an already account with that email"});
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

const beforeConfirm = async(req, res, next) =>{
  try{
    if(req.query.accessToken && tokens.find((tk) => tk == req.query.accessToken)){
      const decoded = jwt.decode(req.query.accessToken);
      req.body.user = decoded.user;

      const result = await user.findOne({ email : decoded.user.email.replace("'","").replace("'","") });
      if(result)
        next();
      else
        errors.sendError(codes.NOT_FOUND, res, { message : "Email Not Found!" });
    }else
      errors.sendError(codes.UNPROCESSABLE, res, { message : "Invalid accessToken!" });
  }catch(e){
    return errors.catchError(res,e);
  }
};

const beforeChangeRole = async(req, res, next) =>{
  try{
    let message;
    if(req.params.userId && isNaN(req.params.userId))
      message= "userId is required and should be a number";
    
    if(!req.body.role || (req.body.role != "ADMIN_ROLE" && req.body.role != "USER_ROLE"))
      message= "role is required with two possible values: ADMIN_ROLE or USER_ROLE";
    
    if(message)
      return errors.sendError(codes.NOT_ALLOWED, res, {message});

    const exists = await user.findOne({ id : req.params.userId});
    if(!exists)
      errors.sendError(codes.NOT_FOUND, res, { message : "User not Found!" });
    else
      next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

module.exports = { loginMiddleware,
                   logoutMiddleware,
                   beforeSendEmail,
                   sendEmailTo,
                   beforeRegister,
                   beforeConfirm,
                   beforeChangeRole
                 };