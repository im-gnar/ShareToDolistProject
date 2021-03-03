const user_name = document.querySelector('#session_id').textContent; // 공백을 제거하지 않고 모든 텍스트를 그대로 가져온다.
const USER = 'USER'

console.log()
function saveSession(user_name) {
    sessionStorage.setItem(USER,user_name);
}

function init() {
    saveSession(user_name);
}

init();