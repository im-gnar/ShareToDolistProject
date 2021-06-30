const express = require('express')
const http = require('http')
var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'app_mysql',
  port:3306,
  user:'root',
  password:'jj123100!!',
  database:'todolist'
})
connection.connect();

const app = express()

const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "http:/0.0.0.0:5000",
    credentials: true
  }
});

io.on('connection', function(socket) {
//  console.log(socket)
  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('newUser', function(data) {

    console.log(data.name + ' 님이 접속하였습니다.')
    /* 소켓에 이름 저장해두기 */
    socket.name = data.name
    connection.query("SELECT * FROM plan WHERE rno=? ORDER BY pno DESC",[
            data.rno], function(err,success){
            if (err) console.log("err");
            else console.log(success);

            io.emit('planUpdate', success);

    /* 모든 소켓에게 전송 */
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: data.name + '님이 접속하였습니다.', todo:success})
    })
  })

  /* 전송한 메시지 받기 */
  socket.on('message', function(data) {
    /* 받은 데이터에 누가 보냈는지 이름을 추가 */
    data.name = socket.name

    console.log(data)

    /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', data);
  })

  /* 접속 종료 */
  socket.on('disconnect', function() {
    console.log(socket.name + '님이 나가셨습니다.')

    /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
  })

  socket.on('newPlan', function(data){
		// todolist 갱신, 갱신된 리스트 반환
	console.log(data.goal, data.roomno)
    connection.query("INSERT INTO plan(pno,rno,text) VALUES ((SELECT IFNULL(MAX(pno)+1, 1) FROM plan p WHERE rno=?), ?, ?)",[
            data.roomno, data.roomno, data.goal], function(err,success){
            if (err) console.log("err");
            else console.log('Data Insert OK');
        });
    connection.query("SELECT * FROM plan WHERE rno=? ORDER BY pno DESC",[
            data.roomno], function(err,success){
            if (err) console.log("err");
            console.log(success);

            io.emit('planUpdate', success);
        });
    });

    socket.on('deletePlan', function(data){
        connection.query("DELETE FROM plan WHERE pno=? and rno=?",[data.pno,data.rno], function(err,success){
            console.log("DELETED");
        });
        connection.query("SELECT * FROM plan WHERE rno=? ORDER BY pno DESC",[
            data.rno], function(err,success){
            if (err) console.log("err");
            io.emit('planUpdate', success);
        });
    });

    socket.on('checkPlan', function(data){
        connection.query("UPDATE plan SET isChecked=? WHERE pno=? AND rno=?",[data.checked,data.pno,data.rno], function(err,success){
            console.log("CHECKED");
        });
        connection.query("SELECT * FROM plan WHERE rno=? ORDER BY pno DESC",[
            data.rno], function(err,success){
            if (err) console.log("err");
            io.emit('planUpdate', success);
        });
    });

    socket.on('editPlan', function(data){
        console.log(data);
        connection.query("UPDATE plan SET text=? WHERE pno=? AND rno=?",[data.text,data.pno,data.rno], function(err,success){
            console.log("updated");
        });
        connection.query("SELECT * FROM plan WHERE rno=? ORDER BY pno DESC",[
            data.rno], function(err,success){
            if (err) console.log("err");
            io.emit('planUpdate', success);
        });
    });
})

/* 서버를 8080 포트로 listen */
server.listen(1230, function() {
  console.log('서버 실행 중.. (1230)')
})
