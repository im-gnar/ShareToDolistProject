const express = require('express')
const http = require('http')
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'localhost',
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
    origin: "http://127.0.0.1:5000",
    credentials: true
  }
});

io.on('connection', function(socket) {
//  console.log(socket)
  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('newUser', function(name) {
    console.log(name + ' 님이 접속하였습니다.')
    /* 소켓에 이름 저장해두기 */
    socket.name = name
    connection.query("SELECT * FROM plan",function(err,success){
    /* 모든 소켓에게 전송 */
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.', todo:success})
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
    let todolist = "";
    /*  type: 'create_todo',
		goal : plan,
		roomno : {current room no} */
		// todolist 갱신, 갱신된 리스트 반환
	console.log(data.goal, data.roomno)
    connection.query("INSERT INTO plan(rno,goal) VALUES (?, ?)",[
            data.roomno, data.goal], function(err,success){
            if (err) console.log("err");
            console.log('Data Insert OK');
        });
    connection.query("SELECT * FROM plan ORDER BY pno DESC LIMIT 1",function(err,success){
            if (err) console.log("err");
            console.log(success);
            io.emit('planUpdate', success);
        });
    })
})

/* 서버를 8080 포트로 listen */
server.listen(1230, function() {
  console.log('서버 실행 중.. (1230)')
})