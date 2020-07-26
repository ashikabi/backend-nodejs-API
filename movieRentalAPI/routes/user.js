const express = require('express');
const { loginMiddleware, 
        logoutMiddleware, 
        beforeSendEmail, 
        sendEmailTo, 
        beforeRegister, 
        beforeConfirm, 
        beforeChangeRole } = require("./middlewares/userMiddleware");
const user = require("../db/models/userModel");
const { isTokenValid, hasAdminRole } = require("./middlewares/generalMiddleware");
const app = express();

app.post('/login', loginMiddleware , (req, res) => {
  delete res.result.password;//==> removing the password because could be obtained from the jwt

  const found = tokens.find((tk) => {
    let decoded = jwt.decode(tk);
    return decoded.user.email == res.result.email
  });

  if(!found){
    const accessToken = jwt.sign({user: res.result}, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRED_TIME });
    tokens.push(accessToken);// ==> adding the token in the array of tokens valids  
    res
      .status(codes.CREATED)
      .json({ accessToken });
  }else{
      res
        .status(codes.OK)
        .json({ message: "You are already logged in",
                accessToken: found });
  }
});

//if a token is expired! we can generate another one if the user is still in session 
app.post('/token', (req, res) => {
  let accessToken = req.headers.authorization;
  const decoded = jwt.decode(accessToken);

  if(tokens.find((tk) => tk == accessToken))
    jwt.verify(accessToken, process.env.JWT_SEED, (err, obj) => {
        if (err) {
          accessToken = jwt.sign(decoded.user, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRED_TIME });
          tokens.push(accessToken);
          res
            .status(codes.CREATED)
            .json({ accessToken });
        }else{
          res
              .status(codes.OK)
              .json({ accessToken });
        }
    });
  else{
    return errors.sendError(codes.FORBIDDEN, res, {message: "You are not a Logged in user"});
  }
});

app.post('/logout',logoutMiddleware , (req, res) => {
  
  res
    .status(codes.OK)
    .json({ message : "Log out" });

});

app.post('/recovery', beforeSendEmail, async(req, res) => {
  try{
    const result = await sendEmailTo({
                                      type: "RECOVERY",
                                      to: req.body.email,
                                      password: req.body.user.password
                                    });
    if(result)
      res.status(codes.OK).json({ message : "An email was sent to you, please check it out!" });
    else 
      errors.sendError(codes.UNPROCESSABLE, res, { message : "It was an internal error sending the email!" });
  }catch(e){
    return errors.catchError(res,e);
  }
});

app.post('/register', 
         [beforeRegister], 
         async(req, res) => {
  try{
    const created = await user.create({
                                        email: `'${req.body.email}'`,
                                        password: `'${req.body.password}'`,
                                        role: "'USER_ROLE'",
                                        status: "'P'"
                                      });
    if(created){
      delete created.password;
      const accessToken = jwt.sign({user: created}, process.env.JWT_SEED);
      tokens.push(accessToken);// ==> adding the token in the array of tokens valids  
      const result = await sendEmailTo({
                                        type: "CONFIRM",
                                        to: req.body.email,
                                        accessToken
                                      });
      if(result)
        res.status(codes.OK).json({ message : "An email was sent to you, please check it out!" });
      else 
        errors.sendError(codes.UNPROCESSABLE, res, { message : "It was an internal error sending the email!" });

    }else
      errors.sendError(codes.UNPROCESSABLE, res, { message : "It was an internal error creating the user!" });
  }catch(e){
    return errors.catchError(res,e);
  }
});

app.get('/confirm',
        beforeConfirm,
        async(req,res)=>{
  try{
      const activated = await user.updateUser({
                                                  id: req.body.user.id ,
                                                  status: 'A'
                                                });
      if(activated){
        tokens = tokens.filter((tk) => tk != req.query.accessToken);//remove the temporary token
        res.status(codes.OK).json({ message : "Account is activated!" });
      }else
        errors.sendError(codes.UNPROCESSABLE, res, { message : "It was an internal error activating your account!" });
  }catch(e){
    return errors.catchError(res,e);
  }
});

app.put('/users/:userId', 
        [isTokenValid, hasAdminRole, beforeChangeRole], 
        async(req, res) => {
  try{
    const updated = await user.updateUser({
                                            id: req.params.userId,
                                            role: req.body.role
                                          }); 
    if(updated)
      res.status(codes.OK).json({message: "User was updated"});
    else
      errors.sendError(codes.UNPROCESSABLE, res, { message : "Couldn't update the user" });
  }catch(e){
    return errors.catchError(res,e);
    }       
});



module.exports = app;
