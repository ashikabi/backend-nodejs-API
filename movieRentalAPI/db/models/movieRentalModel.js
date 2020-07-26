const { movieRental, movie } = require("../tables");
const movieModel = require("./movieModel");
const rentalLog = require("./purchaseAndRentalModel");
const { update } = require("./movieModel");

const penaltyPercent = 0.05;

const findOne = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const columns = movieRental.columns.join(",");
      let where = `${movieRental.where}`;
      if(filter.id)
        where = `${where}  AND id=${filter.id}`
      if(filter.userId)
        where = `${where}  AND userId=${filter.userId}`
      if(filter.movieId)
        where = `${where}  AND movieId=${filter.movieId}`
      if(filter.unreturned)
        where = `${where}  AND returnDate is null`

      const conn = await db.getConnection();
      try{
        const query = `SELECT ${columns} FROM ${movieRental.table} WHERE ${where};`;
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[movieRentalModel] ::::: ${JSON.stringify(error)}`);
            reject(error)
            return;
          }
          resolve(rows);
        });
      }catch(e){
        console.error(`ERROR[movieRentalModel] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  });
};

/*
    1.- Save the entry for rental in movie_rental
    2.- Decrease the stock in the movie table
    3.- Save the log of the rental in purchase_and_rental table
*/
const save = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const columns = movieRental.columns
                                        .filter(col => (col!="id" && col!="penalty" && col!="returnDate"))
                                        .join(",");
      const values = `${data.userId},${data.movieId},now(),DATE_ADD(now(), INTERVAL ${data.days} DAY)`;
  
      const conn = await db.getConnection();
        try{
          const query = `INSERT INTO ${movieRental.table} (${columns}) VALUES(${values});`
          conn.query(query, async(error, result) => {
            if(error){
              console.error(`ERROR[movieRentalModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            const inserted = await findOne({id: result.insertId});
            await movieModel.update({
                                      id: data.movieId,
                                      decreaseStock: data.quantity
                                    });
            await rentalLog.save({
                                  userId: data.userId,
                                  movieId: data.movieId,
                                  transaction: "'R'",
                                  quantity: data.quantity
                                  });
            resolve(inserted);
          });
        }catch(e){
          console.error(`ERROR[movieRentalModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};


/* 
      1.penalty calculation : 
        1.1charge the 5% of the rentalPrice of the movie per day
      2. Update the returnDate and the penalty if there is
      3.-Update the stock in the movie table adding back the number of movies returned.
*/
const returnMovie = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const [obj] = await movieModel.findOne({id: data.movieId});
      const [log] = await rentalLog.findRentalQuantity({ rentalId: data.rentalId });

      const penalty = parseFloat(penaltyPercent * obj.rentalPrice).toFixed(2);
      const where = `${movieRental.where} AND userId=${data.userId} AND movieId=${data.movieId} AND returnDate is null`;
      let values = "returnDate=now()";
      values = `${values}, penalty=((CASE 
                                      WHEN TIMESTAMPDIFF(DAY, shouldReturnDate, now()) > 0 THEN TIMESTAMPDIFF(DAY, shouldReturnDate, now())
                                              ELSE 0
                                      END) * ${penalty} * ${log.quantity})`

      const conn = await db.getConnection();
        try{
          const query = `UPDATE ${movieRental.table} SET ${values} WHERE ${where};`
          conn.query(query, async(error, result) => {
            if(error){
              console.error(`ERROR[movieRentalModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }

            const [updated] = await findOne({id: data.rentalId});
            update.penaltyPercent = penaltyPercent;
            await movieModel.update({
                                      id: data.movieId,
                                      increaseStock: log.quantity
                                    });
            updated.quantity = log.quantity;
            resolve(updated);
          });
        }catch(e){
          console.error(`ERROR[movieRentalModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
}

module.exports = { save,
                   findOne,
                   returnMovie
                  };