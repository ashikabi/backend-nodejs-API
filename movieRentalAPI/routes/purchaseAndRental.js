const express = require('express');
const { isTokenValid, hasUserRole, getUserInSession } = require("./middlewares/generalMiddleware");
const { isAbleToBuy } = require("./middlewares/purchaseMiddleware");
const purchase = require("../db/models/purchaseAndRentalModel");
const movie = require("../db/models/movieModel");
const app = express();

/*
    1. makes the purchase
    2. decrease the stock in the movie
*/
app.post('/movies/:movieId/buy', 
        [isTokenValid, hasUserRole, getUserInSession, isAbleToBuy],
        async(req, res) => {
        
    try{
      const result = await purchase.save({
        userId: req.params.userId,
        movieId: req.params.movieId,
        transaction: "'P'",
        quantity: req.body.quantity
        });
      await movie.update({
                          id: req.params.movieId,
                          decreaseStock: req.body.quantity
                          });
      res
        .status(codes.OK)
        .json({message : `Transaction processed`})
    }catch(e){
      return errors.catchError(res,e);
    }             
});

module.exports = app;
