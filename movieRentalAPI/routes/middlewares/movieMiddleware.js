const like = require("../../db/models/movieLikeModel");
const movie = require("../../db/models/movieModel");
const errors = require("../../utils/errors");

const requiredParams = (req, res, next) =>{
  try{
      let missingParam;
      if(!req.body.title)
        missingParam = "title";
    
      if(!req.body.description)
        missingParam = "description";
    
      if(!req.body.image)
        missingParam = "image";
    
      if(!req.body.stock)
        missingParam = "stock";
    
      if(!req.body.rentalPrice)
        missingParam = "rentalPrice";
    
      if(!req.body.salePrice)
        missingParam = "salePrice";
    
      if(!req.body.availability)
        missingParam = "availability";
    
    if(missingParam){
      return errors.sendError(codes.BAD_REQUEST, res, {message : `${missingParam} is required`});
    }else
      next();// ==> we are good to save in the DB
  }catch(e){
    return errors.catchError(res,e);
  }
};

const availabilityFilter = (req, res, next) =>{
  try{
    if(req.headers.authorization){
      const accessToken = req.headers.authorization;
      const { user } = jwt.decode(accessToken);
      if(user.role != "ADMIN_ROLE")
        req.query.availability = '1';
      
    }else{
      req.query.availability = '1';
    }
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
}

const beforeLike = async(req, res, next) => {
  try{
    let isNotAllowed;
    if(req.params.movieId && isNaN(req.params.movieId))
      isNotAllowed= "movieId";

    if(isNotAllowed)
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
    
    req.params.movieId = parseInt(req.params.movieId);
    const obj  = await like.findOne({
                                        userId: req.params.userId,
                                        movieId: req.params.movieId
                                      });
    if(!obj.length){
      next();// ==> there is no entry for this combination user<-->movie
    }else{
      if(obj[0].like){
        return res
                  .status(codes.OK)
                  .json({
                          error: {
                            code: codes.OK,
                            type: "Found",
                            message: "Already liked",
                            description: "Already liked"
                          }
                        });
      }else{
        await like.unlike({
                            userId: req.params.userId,
                            movieId: req.params.movieId,
                            like: "1"
                          });
        res
          .status(codes.OK)
          .json({message: "You liked that movie"});
      }
    }
  }catch(e){
    return errors.catchError(res,e);
  }
}

const beforeUnlike = async(req, res, next) => {
  try{
    let isNotAllowed;
    if(req.params.movieId && isNaN(req.params.movieId))
      isNotAllowed= "movieId";

    if(isNotAllowed)
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
    
    req.params.movieId = parseInt(req.params.movieId);
    const obj  = await like.findOne({
                                        userId: req.params.userId,
                                        movieId: req.params.movieId
                                      });
    if(obj.length){
      next();// ==> there is one entry for this combination user<-->movie
    }else{
      return errors.sendError(codes.NOT_FOUND, res, {message : `You need to give a like before unlike it :P`});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
}

const beforeDeleteMovie = async(req, res, next) =>{
  try{
    let isNotAllowed;
    if(req.params.movieId && isNaN(req.params.movieId))
      isNotAllowed= "movieId";
     
    if(isNotAllowed)
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
    
    
    req.params.movieId = parseInt(req.params.movieId);
    const obj = await movie.findOne({id: req.params.movieId});
    if(!obj.length){
      return errors.sendError(codes.NOT_FOUND, res, {message : `There is no movie with the movieId (${movieId})`});
    }else{
      next();
    }

  }catch(e){
    return errors.catchError(res,e);
  }
};

/* 
    1.- We get the count/total of the rows
    2.- if start and limit are not coming we just continue returning the whole list
    3.- if just one (start/limit) coming we send an error because we need both to enable pagination
    4.- if one the values is not a number, we send and error
    5.- if the both values comming we just parse them to integers and continue
    6.- get the total of rows
*/
const beforeGetList = async(req, res, next) =>{
  try{
    const [rows] = await movie.countAll({availability: req.query.availability});
    req.query.totalValues = rows.total;

    if(!req.query.limit && !req.query.start) return next();

    if((req.query.start && !req.query.limit) || (!req.query.start && req.query.limit)){
      if(isNotAllowed)
        return errors.sendError(codes.NOT_ALLOWED, res, {message : `start and limit are required for pagination`});
    }

    let isNotAllowed;
    if(req.query.start && isNaN(req.query.start))
      isNotAllowed= "start";
    if(req.query.limit && isNaN(req.query.limit))
      isNotAllowed= "limit";
     
    if(isNotAllowed)
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
    
    next();
  }catch(e){
    return errors.catchError(res,e);
  }
};

module.exports = {
                  requiredParams,
                  availabilityFilter,
                  beforeLike,
                  beforeUnlike,
                  beforeDeleteMovie,
                  beforeGetList
                }