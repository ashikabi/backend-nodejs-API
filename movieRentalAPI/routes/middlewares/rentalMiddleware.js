const movie = require("../../db/models/movieModel");
const rental = require("../../db/models/movieRentalModel");

/* 
        1. Verify if any of the required parameters is diferent from the expected (we need numbers)
        2. We don't care if is a float number we cast it to integer
        3. Go and verify if exists a movie with the movieId
        4. If the movie exists: Verify if has enough stock to rent the quantity the user want
        5. Don't allow renting a movie if the user has a rent in process with the same movieId and is not returned yet
  */
const isAbleToRent = async(req, res, next) =>{
  try{
    let isNotAllowed;
    if(req.params.movieId && isNaN(req.params.movieId))
      isNotAllowed= "movieId";
    if(!req.body.days || isNaN(req.body.days))
      isNotAllowed= "days";
    if(!req.body.quantity || isNaN(req.body.quantity))
      isNotAllowed= "quantity";
  
    if(isNotAllowed)
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
  
    const movieId = parseInt(req.params.movieId);
    const days = parseInt(req.body.days);
    const quantity = parseInt(req.body.quantity);
    //preparing the values for the main process
    req.params.movieId = movieId;
    req.body.days = days;
    req.body.quantity = quantity;
  
    const obj = await movie.findOne({id: movieId});
    if(obj.length){
      if(obj[0].stock < quantity){
        return errors.sendError(codes.UNSUPPORTED, res, {message : `Movies in Stock: ${obj[0].stock} / Requested: ${quantity}`});
      }else{
        const unreturned = await rental.findOne({
                                                  userId: req.params.userId,
                                                  movieId,
                                                  unreturned: true
                                                });
        if(unreturned.length){
          return errors.sendError(codes.NOT_ALLOWED, res, {message : `You already have rented the movie selected and you haven't returned yet`});
        } else{
          next();
        }     
      }
    }else{
      return errors.sendError(codes.NOT_FOUND, res, {message : `There is no movie with the movieId (${movieId})`});
    }
  }catch(e){
    return errors.catchError(res,e);
  }
}

// if the user doesn't have a entry for that movie in the DB that hasn't returned yet. The user doesn't have to return the movie
const beforeReturnMovie = async(req, res, next) =>{
  try{
    let isNotAllowed;
    if(req.params.movieId && isNaN(req.params.movieId))
      isNotAllowed= "movieId";
  
    if(isNotAllowed){
      return errors.sendError(codes.NOT_ALLOWED, res, {message : `${isNotAllowed} is required and should be a number`});
    }else{
        req.params.movieId = parseInt(req.params.movieId);
        const unreturned = await rental.findOne({
                                                  userId: req.params.userId,
                                                  movieId: req.params.movieId,
                                                  unreturned: true
                                                });
  
        if(!unreturned.length){
          return errors.sendError(codes.NOT_ALLOWED, res, {message : `You don't have to return that movie, where did you get it? :D`});
        } else{
          req.params.rentalId = unreturned[0].id
          next();
        } 
    }
  }catch(e){
    return errors.catchError(res,e);
  }
}

module.exports = { isAbleToRent,
                   beforeReturnMovie 
                  };