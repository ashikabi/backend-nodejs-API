const { movieLike } = require("../tables");

const findOne = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const where = `userId=${filter.userId} AND movieId=${filter.movieId}`;
      const conn = await db.getConnection();
      try{
        const query = `SELECT * FROM ${movieLike.table} WHERE ${where};`;
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[movieLikeModel] ::::: ${JSON.stringify(error)}`);
            reject(error)
            return;
          }
          resolve(rows)
        });
      }catch(e){
        console.error(`ERROR[movieLikeModel] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  });
};

const like = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      let columns = movieLike.columns.filter(col => col!="id");
      const values = columns
                            .map((colName) => data[colName])
                            .join(",");
      columns = columns
                        .map((col) => `${movieLike.table}.${col}`)
                        .join(",")
  
      const conn = await db.getConnection();
        try{
          const query = `INSERT INTO ${movieLike.table} (${columns}) VALUES(${values});`
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[movieLikeModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            data.id = result.insertId;
            resolve(data);
          });
        }catch(e){
          console.error(`ERROR[movieLikeModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

const unlike = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const where = `userId=${data.userId} AND movieId=${data.movieId}`;
      const query = `UPDATE ${movieLike.table} SET ${movieLike.table}.like=${data.like} WHERE ${where};`
      const conn = await db.getConnection();
        try{
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[movieLikeModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            data.id = result.insertId;
            resolve(data);
          });
        }catch(e){
          console.error(`ERROR[movieLikeModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

module.exports = {
                  findOne,
                  like,
                  unlike
                  }