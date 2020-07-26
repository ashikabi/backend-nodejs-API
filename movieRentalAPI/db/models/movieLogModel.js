const { movieLog } = require("../tables");

const insert = (data) =>{
  return new Promise((resolve, reject) => {
    (async () => {
      const columns = movieLog.columns
                                      .filter(col => (col!="id" && col!="updateDate"))
                                      .join(",");
      let values = `${data.old.id},'${data.old.title}','${data.new.title}'`;
      values = `${values},${data.old.rentalPrice},${data.new.rentalPrice}`;
      values = `${values},${data.old.salePrice},${data.new.salePrice}`;
  
      const conn = await db.getConnection();
        try{
          const query = `INSERT INTO ${movieLog.table} (${columns}) VALUES(${values});`;
          conn.query(query, (error, result) => {
            if(error){
              console.error(`ERROR[movieLogModel] ::::: ${JSON.stringify(error)}`);
              reject(error);
              return;
            }
            resolve(result);
          });
        }catch(e){
          console.error(`ERROR[movieLogModel] ::::: ${JSON.stringify(e)}`);
          reject(e);
        }finally{
          conn.release();
        }
    })()
  });
};

module.exports = { insert }