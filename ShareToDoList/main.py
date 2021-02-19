from flask import *
import datetime

app = Flask("ToDO")
db = {'test': '1234', 'test2': '5678'}

nowDatetime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
roomList = [{'id':1,'title':'room1','host':"host1"},{'id':2,'title':'room2','host':"host2"}]
# Query = select * from roomList -> dict형으로 변환
# 어떤 식으로 들어오나?

@app.route('/',methods=["post","get"])
def mainpage():
    login=False
    word = request.form.get("roomsearch")
    if word!=None:
        login=True
        resroomList = searchByWord(word)
        return  render_template("main_need_login.html",login = login,date = nowDatetime,
                            roomList = resroomList)
    return render_template("main_need_login.html",login = login,date = nowDatetime,
                            roomList = roomList)


# /user={userid}
@app.route('/user')
def mainpageUsing():
    return render_template("main_logout.html")


# ID, PWD를 POST로 받아와서 DB 데이터와 대조
@app.route('/login', methods=["post", "get"])
def loginpage():
    Error = None
    id = request.form.get('id')  # 초기값 = None
    pwd = request.form.get('pwd')

    if id != None and pwd != None:
        # id not exist error
        if id not in db.keys():
            Error = "ID does not exist"

        # password diff error
        elif db[id] != pwd:
            Error = "Password does not match"

        # login success
        else:
            login = True
            return render_template("main_need_login.html",
                                   date=nowDatetime, login=login, roomList=roomList)
    return render_template("login.html", Error=Error)


@app.route('/signin')
def signinpage():
    return render_template("signin.html")


f_db = {'sist': '1234'}
@app.route('/signin', methods=["post", "get"])
def id_check():
    notify = None
    id = request.form.get('id')
    if id in f_db.keys():
        notify = "다른 아이디를 사용해주세요"
    else:
        notify = "사용 가능한 아이디입니다."
    return render_template("/signin.html", notify=notify)

# {/{room list id}}



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

app.run(host="127.0.0.1",debug=True)
