function init() {
    emailEvent();
    
}
let email = document.querySelector('#inputID').value; // 정규식 체크하려고 email변수를 전역변수로 만들었습니다.

async function emailEvent() {
    const inputId = document.getElementById('inputID');
    const err_name = document.getElementById('inputName')
    const button = document.querySelectorAll('input[type=submit]')[0];
    const ppp = document.querySelector('#inputName').value === "";
    err_name.addEventListener('focusout', event => {
        alert(ppp)
        if (ppp) {
            button.disabled = true;
            button.classList.add('bg-gray-400');
            button.classList.remove('hover:bg-purple-400');
            button.classList.remove('bg-purple-500');
            document.getElementById('error-name').style.color = 'red';
            document.getElementById('error-name').innerText= "이름을 입력해주세요💕";
        } else {
            button.disabled = false;
            button.classList.remove('bg-gray-400');
            button.classList.add('hover:bg-purple-400');
            button.classList.add('bg-purple-500');
            document.getElementById('error-name').style.color = 'blue';
            document.getElementById('error-name').innerText= "고맙습니다💕";
        }
    });

    inputId.addEventListener('focusout', event => {
        email = event.target.value;
        let route = '/emailCheck';
        const data = {
            "email": email
        };

        sendEmailAJAX(data, route);
    });

    async function sendEmailAJAX(data, route) {
        try {
            await sendXMLRequest(data, 'http://' + location.host + route, 'POST')
                .then(res => {
                    const data = JSON.parse(res);
                    if (email.includes('@')) { // 정규식 체크
                        if (data.ok === 'true') {
                            // 사용가능한 이메일이므로 성공했다는 메세지를 아래에 띄워줌 && button disable 상태 풀어주기 && 에러메세지 제거
                            button.disabled = false;
                            button.classList.remove('bg-gray-400');
                            button.classList.add('hover:bg-purple-400');
                            button.classList.add('bg-purple-500');
                            document.getElementById('error-message').style.color = 'blue';
                            document.getElementById('error-message').innerText= '사용 가능한 이메일입니다.';
                        } else {
                            // 사용 불가능하므로 메세지를 아래에 띄워 줌 && button 상태 disable로 변경 && 에러메세지 표시
                            button.disabled = true;
                            button.classList.add('bg-gray-400');
                            button.classList.remove('hover:bg-purple-400');
                            button.classList.remove('bg-purple-500');
                            document.getElementById('error-message').style.color = 'red';
                            document.getElementById('error-message').innerText= '이미 존재하는 이메일입니다.';
                        }
                    } else {
                        button.classList.add('bg-gray-400');
                        button.classList.remove('hover:bg-purple-400');
                        button.classList.remove('bg-purple-500');
                        button.disabled = true;
                        document.getElementById('error-message').style.color = 'red';
                        document.getElementById('error-message').innerText= "이메일 주소에 '@'를 포함해 주세요💕";
                    }

                    
                    
                

                })
                .catch(err => {
                    console.error('error!', err.statusText);
                });
        } catch (err) { //
            console.error(err); //
        }
    }


}

async function sendXMLRequest(data, url, method) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url); // 초기화
        xhr.setRequestHeader('Content-Type', 'application/json');
        // HTTP 요청 헤더의 값을 설정합니다. open() 후, send() 전에 setRequestHeader() 를 호출해야합니다.

        xhr.onreadystatechange = () => {
        // readyState 어트리뷰트가 변경될때마다 호출되는 EventHandler 입니다.
            if (xhr.readyState == xhr.DONE) { // // 이상 없음, 응답 받았음
                if (xhr.status === 200 || xhr.status === 201) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    })
                }
            }
        };

        xhr.onerror = () => {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        if (method === 'GET') {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(data));
        }
    })
}
init();