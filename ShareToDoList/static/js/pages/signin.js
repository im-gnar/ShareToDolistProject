function init() {

    emailEvent();
}

async function emailEvent() {
    const inputId = document.getElementById('inputID');

    inputId.addEventListener('focusout', event => {
        const email = event.target.value;
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
                    const button = document.querySelectorAll('input[type=submit]')[0];
                    if (data.ok === 'true') {
                        // 사용가능한 이메일이므로 성공했다는 메세지를 아래에 띄워줌 && button disable 상태 풀어주기 && 에러메세지 제거
                        button.disabled = false;
                        button.classList.remove('bg-gray-400');
                        button.classList.add('hover:bg-purple-400');
                        button.classList.add('bg-purple-500');
                        document.getElementById('error-message').innerText= '';
                    } else {
                        // 사용 불가능하므로 메세지를 아래에 띄워 줌 && button 상태 disable로 변경 && 에러메세지 표시
                        button.disabled = true;
                        button.classList.add('bg-gray-400');
                        button.classList.remove('hover:bg-purple-400');
                        button.classList.remove('bg-purple-500');
                        document.getElementById('error-message').innerText= '이미 있는 이메일입니다.';
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

        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState == xhr.DONE) {
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