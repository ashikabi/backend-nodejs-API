const movie = require("../../db/models/movieModel");
const errors = require("../../utils/errors");

/* 
    1. Verify if any of the required parameters is diferent from the expected (we need numbers)
    2. We don't care if is a float number we cast it to integer
    3. Go and verify if exists a movie with the movieId
    4. If the movie exists: Verify if has enough stock to rent the quantity the user want
*/
const isAbleToBuy = async(req, res, next) =>{
  try{
    let isNotAllowed;
    if(req.params.movieId && isNaN(req.params.movieId))
      isNotAllowed= "movieId";
    if(!req.body.quantity || isNaN(req.body.quantity))
      isNotAllowed= "quantity";
  
    if(isNotAllowed)
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
  
    req.params.movieId = parseInt(req.params.movieId);
    req.body.quantity = parseInt(req.body.quantity);
  
    const obj = await movie.findOne({id: req.params.movieId});
    if(obj.length){
      if(obj[0].stock < req.body.quantity){
        return errors.sendError(codes.UNSUPPORTED, res, {message : `Movies in Stock: ${obj[0].stock} / Requested: ${req.body.quantity}`});
      }else{
        next();
      }
  
    }else{
      return errors.sendError(codes.NOT_FOUND, res, {message : `There is no movie with the movieId (${movieId})`});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
};

module.exports = { isAbleToBuy }