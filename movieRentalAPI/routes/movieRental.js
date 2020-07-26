const express = require('express');
const { isTokenValid, hasUserRole, getUserInSession } = require("./middlewares/generalMiddleware");
const { isAbleToRent, beforeReturnMovie } = require("./middlewares/rentalMiddleware");
const movieRental = require("../db/models/movieRentalModel");
const app = express();

//Rent a movie
app.post('/movies/:movieId/rent', 
        [isTokenValid, hasUserRole, getUserInSession, isAbleToRent],
        async(req, res) => {
  try{
        const [result] = await movieRental.save({
                userId: req.params.userId,
                movieId: req.params.movieId,
                days: req.body.days,
                quantity: req.body.quantity
               });

        res
           .status(codes.OK)
           .json({message : `Rented! Please remember to return the movie before [${result.shouldReturnDate}] to avoid penalties.`})
  }catch(e){
    return errors.catchError(res,e);
    }       
});

//Return a movie
app.patch('/movies/:movieId/return', 
         [isTokenValid, hasUserRole, getUserInSession, beforeReturnMovie],
         async (req, res) => {
    try{
        const result = await movieRental.returnMovie({
                userId: req.params.userId,  
                movieId: req.params.movieId,
                rentalId: req.params.rentalId
                });

        const detail = parseInt(result.quantity)>1? `(for ${result.quantity} movies)`:"";
        res
           .status(codes.OK)
           .json({
                  penalty: result.penalty,
                  message: `You have to pay $ ${result.penalty}${detail} there is a charge of 5% over the rentalPrice per delayed day.`,
                  details: `expected return date : [${result.shouldReturnDate}]`
                 })
    }catch(e){
        return errors.catchError(res,e);
    }        
});

//TODO: list all the rental entries that I haven't returned yet???? 

module.exports = app;
