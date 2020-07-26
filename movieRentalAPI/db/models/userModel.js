const { user } = require("../tables");

/*
filter = {email : "my.email@gmail.com"}
*/
const findOne = (filter) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const columns = user.columns.join(",");

      const values = user.columns
                        .filter((colName) => filter.hasOwnProperty(colName))
                        .map((colName) => `${colName}="${filter[colName]}"`)
                        .join(" AND ")

      const where = `${user.where} AND ${values}`;
      const query = `SELECT ${columns} FROM ${user.table} WHERE ${where} ;`;
      const conn = await db.getConnection();
      try{
        conn.query(query, (error, rows) => {
          if(error){
            console.error(`ERROR[userModel] ::::: ${JSON.stringify(error)}`);
            reject(error);
            return;
          }
          resolve(rows[0]);
        });
      }catch(e){
        console.error(`ERROR[userModel] ::::: ${JSON.stringify(e)}`);
        reject(e);
      }finally{
        conn.release();
      }
    })()
  })
};

const create = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      let columns = user.columns.filter(col => (col!="id" && col!="created"));
      const values = columns
                            .map((colName) => data[colName])
                            .join(",");
      columns = columns.join(",");
  
      const conn = await db.getConnection();
        try{
          const query = `INSERT INTO ${user.table} (${columns}) VALUES(${values});`
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[userModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            data.id = result.insertId;
            resolve(data);
          });
        }catch(e){
          console.error(`ERROR[userModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

const updateUser = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const where = `id=${data.id}`
      let values = "";
      if(data.status)
        values = `status='${data.status}'`;
      
      if(data.role)
        values = `role='${data.role}'`;
  
      const conn = await db.getConnection();
        try{
          const query = `UPDATE ${user.table} SET ${values} WHERE ${where};`
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[userModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            data.id = result.insertId;
            resolve(data);
          });
        }catch(e){
          console.error(`ERROR[userModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

module.exports = { findOne,
                   create,
                   updateUser
                  }