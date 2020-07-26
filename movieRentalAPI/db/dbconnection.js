const mysql = require('mysql');

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

const getConnection = () =>{
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) 
				reject(err); 
			resolve(connection);
		});
	});
};


module.exports = {getConnection};