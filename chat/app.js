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

    /* 모든 소켓에게 전송 */
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
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
    connection.query("SELECT * FROM plan",function(err,success){
            if (err) console.log("err");
            deleteNothing();
            io.emit('planUpdate', success);
//            [ TextRow { PNO: 1, RNO: 71, goal: 'todolist', achievement: 0 },
//              TextRow { PNO: 2, RNO: 71, goal: 'todolist2', achievement: 0 },
//              TextRow { PNO: 3, RNO: 71, goal: 'ssssss', achievement: 0 },
//              TextRow { PNO: 4, RNO: 71, goal: 'todolist', achievement: 0 },
//              TextRow { PNO: 5, RNO: 71, goal: 'this', achievement: 0 } ]
        });
    })
// todo.js
    global.document = new JSDOM('../ShareToDoList/templates/room.html').window.document;
    const test = document.querySelector(".text-white");
    console.log(test);

    const toDoForm = document.querySelector(".js-toDoForm"),
	toDoInput = toDoForm.querySelector(".js-toDoInput"),
	toDoList = document.querySelector(".js-toDoList"),
	toDoProgressBar = document.querySelector(".js-toDoProgressBar"),
	completed = document.querySelector(".js-completed"),
	nothing = document.querySelector(".js-nothing");

    const TODOS_LS = "toDos";
    const SHOWING_CN = "showing";

//    let toDos = [];
    let checkedNum = 0;
    let previousPercent = 0;

    function deleteNothing(){
        nothing.classList.remove(SHOWING_CN);
    }

    function paintNothing(){
        nothing.classList.add(SHOWING_CN);
    }

//    function saveToDos(){
//        localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
//        deleteNothing();
//    }

    function editToDo(event){
        event.preventDefault();
        let editForm;
        if(event.target.className === "submitBtn"){
            const submitBtn = event.target;
            const editBtnspan = submitBtn.parentNode;
            editForm = editBtnspan.parentNode;
        } else {
            editForm = event.target;
        }
        const editInput = editForm.querySelector(".editInput");
        const empty = editForm.querySelector(".empty");
        const text = editInput.value;
        if(text === ""){
            //nothing written
            empty.classList.add(SHOWING_CN);
        } else {
            //show edited to do list
            empty.classList.remove(SHOWING_CN);
            const li = editForm.parentNode;
            editForm.removeChild(editInput);
            li.removeChild(editForm);
            const label = document.createElement("label");
            const checkBox = document.createElement("input");
            checkBox.setAttribute("type", "checkbox");
            checkBox.setAttribute("class", "todoCheck");
            const span = document.createElement("span");
            span.setAttribute("class", "content");
            const btnSpan = document.createElement("span");
            btnSpan.setAttribute("class", "controlBtns");
            const editBtn = document.createElement("button");
            editBtn.setAttribute("class", "editBtn");
            editBtn.innerText = "✏"
            const delBtn = document.createElement("button");
            delBtn.setAttribute("class", "delBtn");
            delBtn.innerText = "❌";
            checkBox.addEventListener("change", checkBoxChange);
    //		editBtn.innerText = "edit";
            editBtn.addEventListener("click", showEdit);
    //		delBtn.innerText = "delete";
            delBtn.addEventListener("click", deleteToDo);
            span.innerText = `${text}`;
            li.appendChild(label);
            label.appendChild(checkBox);
            label.appendChild(span);
            li.appendChild(btnSpan);
            btnSpan.appendChild(editBtn);
            btnSpan.appendChild(delBtn);
            connection.query("SELECT * FROM plan",function(success){
            io.emit('planUpdate', success);
            });
//            //저장
//            for(var i = 0; i < toDos.length; i++){
//                if(toDos[i].id === parseInt(li.id)){
//                    toDos[i].text = text;
//                };
//            }
//            saveToDos();
        }
    }

    //edit undo
    function undo(event){
        //hide editForm
        //li > form > input, editBtns(undoBtn, submitBtn), editEmpty
        const undoBtn = event.target;
        const editBtns = undoBtn.parentNode;
        const editForm = editBtns.parentNode;
        const li = editForm.parentNode;
        const pno = li.id;
        const editInput = editForm.querySelector(".editInput");
        const editEmpty = editForm.querySelector(".empty");
        editEmpty.classList.remove(SHOWING_CN);
        li.removeChild(editForm);
        //show to do list (label, btns)
        //li > label > input(checkbox), span(content)
        const label = document.createElement("label");
        const checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", "todoCheck");
        const content = document.createElement("span");
        content.setAttribute("class", "content");
        //li > span(btns) > img(editBtn), img(delBtn)
        const btns = document.createElement("span");
        btns.setAttribute("class", "controlBtns");
        const editBtn = document.createElement("button");
        editBtn.setAttribute("class", "editBtn");
        editBtn.innerText = "✏";
        const delBtn = document.createElement("button");
        delBtn.setAttribute("class", "delBtn");
        delBtn.innerText = "❌";
        //eventListener(checkbox, edit, delete)
        checkBox.addEventListener("change", checkBoxChange);
        editBtn.addEventListener("click", showEdit);
        delBtn.addEventListener("click", deleteToDo);
        connection.query("SELECT * FROM plan WHERE pno = ?",[pno],function(success){
                if(success.achievement === 0) checkBox.checked = false;
                else checkBox.checked = true;
                content.innerText = success.goal;
        });
//
//        for(var i = 0; i < toDos.length; i++){
//            if(toDos[i].id === parseInt(li.id)){
//                console.log(toDos[i].id);
//                console.log(li.id);
//                console.log(toDos[i].text);
//                checkBox.checked = toDos[i].isChecked;
//                const text = toDos[i].text;
//                content.innerText = `${text}`;
//            };
//        }
        li.appendChild(label);
        label.appendChild(checkBox);
        label.appendChild(content);
        li.appendChild(btns);
        btns.appendChild(editBtn);
        btns.appendChild(delBtn);
    }

    function showEdit(event){
        //hide to do list (label, btns)
        //li > label(checkbox, content), btns(editBtn, delBtn)
        const editBtn = event.target;
        const btns = editBtn.parentNode;
        const li = btns.parentNode;
        const label = li.querySelector("label");
        const content = li.querySelector(".content");
        li.removeChild(label);
        li.removeChild(btns);
        //show editForm
        //form > input, editBtns(undoBtn, submitBtn), editEmpty
        const editForm = document.createElement("form");
        const editInput = document.createElement("input");
        editInput.setAttribute("type", "text");
        editInput.setAttribute("class", "editInput");
        editInput.setAttribute("placeholder", "EDIT YOUR TO DO!");
        editInput.setAttribute("value", content.innerText);
        const editBtns = document.createElement("span");
        editBtns.setAttribute("class", "controlBtns");
        const undoBtn = document.createElement("button");
        undoBtn.setAttribute("class", "undoBtn");
        undoBtn.innerText = "↩";
        const submitBtn = document.createElement("button");
        submitBtn.setAttribute("class", "submitBtn");
        submitBtn.innerText = "☑";
        const editEmpty = document.createElement("div");
        editEmpty.setAttribute("class", "empty");
        editEmpty.innerText = "You can't leave this empty."
        li.appendChild(editForm);
        editForm.appendChild(editInput);
        editForm.appendChild(editBtns);
        editBtns.appendChild(undoBtn);
        editBtns.appendChild(submitBtn);
        //eventListener(undo, submitBtn, submitEnter)
        undoBtn.addEventListener("click", undo);
        submitBtn.addEventListener("click", editToDo);
        editForm.appendChild(editEmpty);
        editForm.addEventListener("submit", editToDo);
    }

    function paintProgressBar(checkedNum){
//        let percent = 0;
        //퍼센트 계산: round(checked/to do * 100)
        connection.query("SELECT COUNT(*) FROM plan",function(success){
            let percent = 0;
            if(success!==0) percent = Math.round(checkedNum / success * 100);
            let width = previousPercent;
            //퍼센트 증가
            if(percent >= previousPercent){
                const id = setInterval(function(){
                    //넓이가 퍼센트와 같거나 더 커졌을 때 > stop
                    if(width >= percent){
                        clearInterval(id);
                    //width 점점 늘어남
                    } else {
                        width++;
                        toDoProgressBar.style.width = `${width}%`;
                        completed.innerText = `${width}% completed`;
                    }
                }, 5);
            //퍼센트 감소
            } else{
                const id = setInterval(function(){
                    if(width <= percent){
                        clearInterval(id);
                    } else {
                        width--;
                        toDoProgressBar.style.width = `${width}%`;
                        completed.innerText = `${width}% completed`;
                    }
                }, 5);
            }
            //이전 퍼센트가 됨
            previousPercent = percent;
        });
//        if(toDos.length != 0) {
//            percent = Math.round(checkedNum / toDos.length * 100);
//        }
//        //(처음)넓이: 이전 퍼센트
//        let width = previousPercent;
//        //퍼센트 증가
//        if(percent >= previousPercent){
//            const id = setInterval(function(){
//                //넓이가 퍼센트와 같거나 더 커졌을 때 > stop
//                if(width >= percent){
//                    clearInterval(id);
//                //width 점점 늘어남
//                } else {
//                    width++;
//                    toDoProgressBar.style.width = `${width}%`;
//                    completed.innerText = `${width}% completed`;
//                }
//            }, 5);
//        //퍼센트 감소
//        } else{
//            const id = setInterval(function(){
//                if(width <= percent){
//                    clearInterval(id);
//                } else {
//                    width--;
//                    toDoProgressBar.style.width = `${width}%`;
//                    completed.innerText = `${width}% completed`;
//                }
//            }, 5);
//        }
//        //이전 퍼센트가 됨
//        previousPercent = percent;
    }

    function selectCheckedNum(){
        connection.query("SELECT COUNT(*) FROM plan WHERE achievement = 1",function(success){
            paintProgressBar(success)
        })
    }
//        checkedNum = 0;
//        for(var i = 0; i < toDos.length; i++){
//            if(toDos[i].isChecked === true){
//                checkedNum = checkedNum + 1;
//            }
//        }
//        //프로그레스 바
//        paintProgressBar(checkedNum);
//    }

    function deleteToDo(event){
        const btn = event.target;
        const btnSpan = btn.parentNode;
        const li = btnSpan.parentNode;
        const pno = li.id;
        connection.query("DELETE FROM plan WHERE pno =?",[pno],function(success){
            console.log("DELETED");
        });
        connection.query("SELECT COUNT(*) FROM plan",function(success){
            if(success===0) paintNothing;
            else {
                connection.query("SELECT * FROM plan",function(success){
                io.emit('planUpdate', success);
                });
            }
        });
        selectCheckedNum();
    };
        //paint X
//        const btn = event.target;
//        const btnSpan = btn.parentNode;
//        const li = btnSpan.parentNode;
//        toDoList.removeChild(li);
//        //저장
//        const cleanToDos = toDos.filter(function(toDo){
//            return toDo.id !== parseInt(li.id);
//        });
//        toDos = cleanToDos;
//        saveToDos();

        //nothing to do
//        if(toDos.length === 0){
//            paintNothing();
//        }
        //체크수 조회 + 프로그레스 바
//        selectCheckedNum();
//    }

    //checkbox clicked
    function checkBoxChange(event){
        const checkBox = event.target;
        const label = checkBox.parentNode;
        const li = label.parentNode;
        const isChecked = checkBox.checked;
        const pno = li.id;
        const achieve = 0;
        if (isChecked===true) achieve = 1;
         connection.query("UPDATE plan SET achievement = ? WHERE pno = ?",[achieve,pno],function(success){
            console.log("UPDATED");
         });
         connection.query("SELECT * FROM plan",function(success){
            io.emit('planUpdate', success);
         });
//        //저장
//        for(var i = 0; i < toDos.length; i++){
//            if(toDos[i].id === parseInt(li.id)){
//                toDos[i].isChecked = isChecked;
//            };
//        }
//        saveToDos();
        //체크수 조회 + 프로그레스 바
        selectCheckedNum();
    }

//    function paintToDo(text, isChecked){
//        //li > label > input(checkbox), span(content)
//        const li = document.createElement("li");
//        const label = document.createElement("label");
//        const checkBox = document.createElement("input");
//        checkBox.setAttribute("type", "checkbox");
//        checkBox.setAttribute("class", "todoCheck");
//        checkBox.checked = isChecked;
//        const content = document.createElement("span");
//        content.setAttribute("class", "content");
//        //li > span(btns) > img(editBtn), img(delBtn)
//        const btns = document.createElement("span");
//        btns.setAttribute("class", "controlBtns");
//        const editBtn = document.createElement("button");
//        editBtn.setAttribute("class", "editBtn");
//        editBtn.innerText = "✏";
//        const delBtn = document.createElement("button");
//        delBtn.setAttribute("class", "delBtn");
//        delBtn.innerText = "❌";
//        //eventListener(checkbox, edit, delete)
//        checkBox.addEventListener("change", checkBoxChange);
//        editBtn.addEventListener("click", showEdit);
//        delBtn.addEventListener("click", deleteToDo);
//        content.innerText = `${text}`;
//        li.appendChild(label);
//        label.appendChild(checkBox);
//        label.appendChild(content);
//        li.appendChild(btns);
//        btns.appendChild(editBtn);
//        btns.appendChild(delBtn);
//        const newId = toDos.length + 1;
//        li.id = newId;
//        toDoList.appendChild(li);
        //저장
//        const toDoObj = {
//                text: text,
//                id: newId,
//                isChecked: isChecked
//        };
//        toDos.push(toDoObj);
//        saveToDos();
//    }

    //to do 작성완료
//  function toDoSubmit(event){
//     event.preventDefault();
//     const currentValue = toDoInput.value;
//
//     paintToDo(currentValue, false);
//     //체크수 조회 + 프로그레스 바
     selectCheckedNum();
//     toDoInput.value = "";
//  }

  function loadToDos(){
    // where rno = roomno
    connection.query("SELECT COUNT(*) FROM plan",function(success){
        if(success===0){
            paintNothing();
        } else {
            connection.query("SELECT * FROM plan",function(todos) {
//                todos.forEach((todo)=>{
//                    paintToDo(todo.goal, todo.achievement===0?false:true);
//                })
                io.emit('planUpdate', todos);
            });
            selectCheckedNum();
        }
    });
  };

  function init(){
	loadToDos();
//	toDoForm.addEventListener("submit", toDoSubmit);
  }
  init();

})

/* 서버를 8080 포트로 listen */
server.listen(1230, function() {
  console.log('서버 실행 중.. (1230)')
})