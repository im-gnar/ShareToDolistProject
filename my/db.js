var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'jj123100!!',
  database : 'todolist',
  port: 3306
});
function getRes(){
    return new Promise(function(resolve,reject){
        connection.connect();

        connection.query('SELECT * FROM member', function(err, results, fields) {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
        connection.end();
    });
}
getRes().then(function(results){
    console.log("res",results)
    console.log(results.length)
}).catch();