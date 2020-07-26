const express = require('express');
const { isTokenValid, 
        hasAdminRole, 
        beforeSave, 
        hasUserRole, 
        getUserInSession } = require("./middlewares/generalMiddleware");
const { requiredParams, 
        availabilityFilter, 
        beforeLike, 
        beforeUnlike, 
        beforeDeleteMovie, 
        beforeGetList } = require("./middlewares/movieMiddleware");
const movie = require("../db/models/movieModel");
const like = require("../db/models/movieLikeModel");
const app = express();

app.post('/movies', 
         [isTokenValid, hasAdminRole, requiredParams, beforeSave], 
         async (req, res) => {
  try{
      const data = await movie.insert(req.body);
      res
        .status(codes.CREATED)
        .json(data);
  }catch(e){
    return errors.catchError(res,e);
  }
  })

app.get('/movies', 
       [availabilityFilter, beforeGetList],
       async(req, res) => {
        
  try{
    const filter = {}
    filter.availability = req.query.availability;
    if(req.query.name)
      filter.name = req.query.name;
    if(req.query.limit && req.query.start){
      filter.limit = req.query.limit;
      filter.start = req.query.start;
    }
  
    const movieList = await movie.findAll(filter);
    const result = {
      total : req.query.totalValues,
      result : movieList
    }
    res
      .status(codes.OK)
      .json(result);
  }catch(e){
    return errors.catchError(res,e);
  }
});

app.get('/movies/:movieId',
        availabilityFilter, 
        async(req, res) => {
  try{
    let [obj] = await movie.findOne({id: req.params.movieId,
                                     availability: parseInt(req.query.availability)
                                    });
    if(!obj)
      obj = {message: "There is no movie"}
    res
      .status(codes.OK)
      .json(obj);
  }catch(e){
    return errors.catchError(res,e);
  }
});

app.put('/movies/:movieId', 
        [isTokenValid, hasAdminRole, beforeSave], 
        async(req, res) => {
  try{
    const body = req.body;
    body.id = req.params.movieId;
    const obj = await movie.update(body); 
    
    res
      .status(codes.OK)
      .json(obj);
  }catch(e){
    return errors.catchError(res,e);
    }       
});

app.delete('/movies/:movieId', 
        [isTokenValid, hasAdminRole, beforeDeleteMovie], 
        async(req, res) => {
  try{
    await movie.deleteMovie({id: req.params.movieId}); 
    
    res
      .status(codes.OK)
      .json({message : "Movie was deleted!"});
  }catch(e){
    return errors.catchError(res,e);
    }       
});

app.post('/movies/:movieId/like', 
        [isTokenValid, hasUserRole, getUserInSession, beforeLike],
        async(req, res) => {
    try{

      await like.like({
                        userId: req.params.userId,
                        movieId: req.params.movieId,
                        like: "1"
                      });
      res
        .status(codes.OK)
        .json({message: "You liked that movie"});
    }catch(e){
      return errors.catchError(res,e);
    }  
});

app.post('/movies/:movieId/unlike', 
        [isTokenValid, hasUserRole, getUserInSession, beforeUnlike],
        async(req, res) => {

  try{
    await like.unlike({
                        userId: req.params.userId,
                        movieId: req.params.movieId,
                        like: "0"
                      });
    res
       .status(codes.OK)
       .json({message: "You unliked that movie"});
  }catch(e){
    return errors.catchError(res,e);
  }

});

module.exports = app;
