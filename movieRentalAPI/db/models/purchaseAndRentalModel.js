const { purchaseAndRental, movieRental } = require("../tables");

const save = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      let columns = purchaseAndRental.columns.filter(col => (col!="id" && col!="transactionDate"));
      const values = columns
                            .map((colName) => data[colName])
                            .join(",");
      columns = columns.join(",");
  
      const conn = await db.getConnection();
        try{
          const query = `INSERT INTO ${purchaseAndRental.table} (${columns}) VALUES(${values});`;
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[purchaseAndRental] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            data.id = result.insertId;
            resolve(data);
          });
        }catch(e){
          console.error(`ERROR[purchaseAndRental] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

const findRentalQuantity = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      
      const query = `SELECT pr.quantity 
                      FROM ${purchaseAndRental.table} pr 
                        JOIN ${movieRental.table} mr 
                        ON (pr.userId = mr.userId AND pr.movieId=mr.movieId)
                      WHERE mr.id=${filter.rentalId}
                      AND 0 = TIMESTAMPDIFF(DAY, pr.transactionDate, mr.rentalDate); `;

      const conn = await db.getConnection();
      try{
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[purchaseAndRental] ::::: ${JSON.stringify(error)}`);
            reject(error)
            return;
          }
          resolve(rows);
        });
      }catch(e){
        console.error(`ERROR[purchaseAndRental] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  });
};

module.exports = { save, 
                   findRentalQuantity
                  }