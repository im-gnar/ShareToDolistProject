from flask import *
import datetime
import pymysql
from ShareToDolistProject.ShareToDoList.templates.test import db


app = Flask("ToDO", static_url_path='/static')  # static 폴더 참조
# dbe = [{'id':'test@naver.com', 'pwd':'1234'}, {'id':'test2@naver.com', 'pwd':'5678'}]
nowDatetime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
roomList = [{'id': 1, 'title': 'room1', 'host': "host1"},
            {'id': 2, 'title': 'room2', 'host': "host2"}]
# Query = select * from roomList -> dict형으로 변환
# 어떤 식으로 들어오나?


@app.route('/', methods=["post", "get"])
def mainpage():
    login = False
    word = request.form.get("roomsearch")
    print(word)
    if word != None:
        login = True
        resroomList = searchByWord(word)
        return render_template("main.html", login=login, date=nowDatetime,
                               roomList=resroomList)
    return render_template("main.html", login=login, date=nowDatetime,
                           roomList=roomList)


# ID, PWD를 POST로 받아와서 DB 데이터와 대조
@app.route('/login', methods=["post", "get"])
def loginpage():
    Error = None
    id = request.form.get('id')  # 초기값 = None
    pwd = request.form.get('pwd')

    if id != None and pwd != None:
        # id not exist error
            if id not in db[0]['id']:
                Error = "ID does not exist"
            # password diff error
            elif db[0]['pwd'] != pwd:
                Error = "Password does not match"
            # login success
            else:
                login = True
                return render_template("main.html",
                                   date=nowDatetime, login=login, roomList=roomList)
    return render_template("login.html", Error=Error)

# db = [{'id':'test@naver.com', 'pwd':'1234'}, {'id':'test2@naver.com', 'pwd':'5678'}]
notify = None
@app.route('/signin', methods=["post", "get"])
def sign_in_page():
    global notify
    id = request.form.get('id')
    for count in range(len(db)):
        if id != db[count]['id']:
            pass
        else:
            notify = "다른 아이디를 사용해주세요"
            return notify
    notify = "사용 가능한 아이디입니다."
    pwd = request.form.get('pwd')
    data = {}
    data['id'] = id
    data['pwd'] = pwd
    return render_template('signin.html', notify=notify)

# {/id={room.id}}

@app.route('/todolist')
def todopage():
    return render_template("todolist.html")


def searchByWord(word):
    word = word.lower()
    results = []
    for room in roomList:
        if word in room['title'].lower():
            results.append(room)
    return results

app.run(host="127.0.0.1", debug=True)

