const { movie } = require("../tables");
const movieLog = require("./movieLogModel");

const findOne = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const complement = filter.availability? `AND m.availability = ${filter.availability}` : "";
      const query =  `SELECT t.id,t.title,t.description,t.image,t.stock,t.rentalPrice,t.salePrice,t.likes
                      FROM (SELECT m.*,(SELECT COUNT(1) FROM movie_like ml WHERE ml.movieId = m.id AND ml.like=1) as likes
                          FROM movie m
                          WHERE m.status = 'A'
                          AND m.id = ${filter.id}
                          ${complement}) t
                      ORDER BY t.title,t.likes;`;

      const conn = await db.getConnection();
      try{
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[movieModel] ::::: ${JSON.stringify(error)}`);
            reject(error)
            return;
          }
          resolve(rows)
        });
      }catch(e){
        console.error(`ERROR[movieModel] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  });
};

const findAll = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      let pagination = "";
      if(filter.limit && filter.start)
        pagination = `LIMIT ${filter.limit} OFFSET ${filter.start}`
      

      const complement = filter.availability? `AND m.availability = ${filter.availability}` : "";
      const query =  `SELECT t.id,t.title,t.description,t.image,t.stock,t.rentalPrice,t.salePrice,t.likes
                      FROM (SELECT m.*,(SELECT COUNT(1) FROM movie_like ml WHERE ml.movieId = m.id AND ml.like=1) as likes
                          FROM movie m
                          WHERE m.status = 'A'
                          ${complement}) t
                      ORDER BY t.title,t.likes ${pagination};`;
      const conn = await db.getConnection();
      try{
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[movieModel] ::::: ${JSON.stringify(error)}`);
            reject(error)
            return;
          }
          resolve(rows)
        });
      }catch(e){
        console.error(`ERROR[movieModel] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  });
};

const countAll = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const complement = filter.availability? `AND availability = ${filter.availability}` : "";

      const query =  `SELECT COUNT(1) as total FROM movie WHERE status = 'A' ${complement};`;
      const conn = await db.getConnection();
      try{
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[movieModel] ::::: ${JSON.stringify(error)}`);
            reject(error)
            return;
          }
          resolve(rows)
        });
      }catch(e){
        console.error(`ERROR[movieModel] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  });
};

const insert = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      let columns = movie.columns.filter(col => (col!="id" && col!="status"));
      const values = columns
                            .map((colName) => data[colName])
                            .join(",");
      columns = columns.join(",");
  
      const conn = await db.getConnection();
        try{
          const query = `INSERT INTO ${movie.table} (${columns}) VALUES(${values});`
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[movieModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            data.id = result.insertId;
            resolve(data);
          });
        }catch(e){
          console.error(`ERROR[movieModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

const update = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const [old] = await findOne({id: data.id});
      const columns = movie.columns.filter(col => (col!="id" && col!="status"));
      let values = "";

      for (const [key, value] of Object.entries(data)) {
        if(columns.find((col) => col == key))
          values = `${values}, ${key}=${value}`
      }
      if(values.length)
        values = values.slice(1);
      let where = `${movie.where} AND id=${data.id}`

      if(data.decreaseStock){
        values = `stock=stock-${data.decreaseStock}`
        where = `${where} AND 0<=stock-${data.decreaseStock}`
      }
      if(data.increaseStock){
        values = `stock=stock+${data.increaseStock}`
      }
      
      const conn = await db.getConnection();
        try{
          const query = `UPDATE ${movie.table} SET ${values} WHERE ${where};`
          conn.query(query, async(error, result) => {
            if(error){
              console.error(`ERROR[movieModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            const [updated] = await findOne({id: data.id});
            if(data.title || data.rentalPrice || data.salePrice)
              await movieLog.insert({
                                      old,
                                      new: updated
                                    });
            resolve(updated);
          });
        }catch(e){
          console.error(`ERROR[movieModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

const deleteMovie = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const where = `${movie.where} AND id=${data.id}`
      const query = `UPDATE ${movie.table} SET status='D' WHERE ${where};`
      const conn = await db.getConnection();
        try{
          conn.query(query, async(error, result) => {
            if(error){
              console.error(`ERROR[movieModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            resolve(result);
          });
        }catch(e){
          console.error(`ERROR[movieModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

module.exports = {
                  findOne,
                  findAll,
                  insert,
                  update,
                  deleteMovie,
                  countAll
                }