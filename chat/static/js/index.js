var socket = io()

/* 접속 되었을 때 실행 */
socket.on('connect', function() {
  /* 이름을 입력받고 */
  var name = prompt('반갑습니다!', '')

  /* 이름이 빈칸인 경우 */
  if(!name) {
    name = '익명'
  }

  /* 서버에 새로운 유저가 왔다고 알림 */
  socket.emit('newUser', name)
})

function createPlan() {
    var plan = document.getElementById('todoInput').value   // input value
    document.getElementById('todoInput').value = ''

    socket.emit('newPlan',{
        type: 'create_todo',
		goal : plan,
		roomno : {current room no}
    })

}



/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
//    var chat = document.getElementById('chat')
  var chat = document.getElementById('chatmsg')
//    var message = document.createElement('div')
  var message = document.createElement('li')

  var namediv = document.createElement('div')
  var name = document.createElement('span')
  var content = document.createElement('p')

  name.innerText = `${data.name}`
  content.innerText = `${data.message}`

  var node = document.createTextNode(`${data.name}: ${data.message}`)
  var className = ''

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }

//  message.classList.add(className)

  message.classList.add("clearfix")
  namediv.classList.add("mb-2 mt-4 align-left text-white")
  name.classList.add("text-black")
  content.classList.add("bg-blue-300 align-left text-white w-10/12 px-10 max-w-xs py-3 rounded break-words")

  namediv.appendChild(name)
  message.appendChild(namediv)
  message.appendChild(content)

//  message.appendChild(node)

  chat.appendChild(message)
})

/* 메시지 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value
  
  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = ''

  // 내가 전송할 메시지 클라이언트에게 표시
  var chat = document.getElementById('chatmsg')
//  var msg = document.createElement('div')
//  var node = document.createTextNode(message)

  var msg = document.createElement('li')
  var content = document.createElement('p')
  content.innerText = message

//  msg.classList.add('me')
//  msg.appendChild(node)
  message.classList.add("clearfix pt-10")
  content.classList.add("float-right bg-yellow-400 text-right text-white max-w-xs px-6 py-3 rounded break-words")
  msg.appendChild(content)
  chat.appendChild(msg)

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', {type: 'message', message: message})
}
