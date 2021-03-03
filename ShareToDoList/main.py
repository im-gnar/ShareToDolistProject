from flask import *
import datetime
import pymysql
import re
import json
app = Flask("ToDO", static_url_path='/static') # static 폴더 참조
nowDatetime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
roomList = [{'id': 1, 'title': 'room1', 'host': "host1"},
            {'id': 2, 'title': 'room2', 'host': "host2"}]


# Query = select * from roomList -> dict형으로 변환
# 어떤 식으로 들어오나?


@app.route('/', methods=["post", "get"])
def mainpage():
    login = False
    # room search
    word = request.form.get("roomsearch")
    roomtitle = request.form.get("roomtitle")
    print(roomtitle)
    if word != None:
        login = True
        return render_template("main.html", login=login, roomList=searchByWord(word))
    # create room
    if roomtitle != None:
        login = True
        host = 'localhost'
        addRoom(host, roomtitle)
        return render_template("main.html", login=login, roomList=selectroom())

    return render_template("main.html", login=login,
                           roomList=selectroom())






# ID, PWD를 POST로 받아와서 DB 데이터와 대조
@app.route('/login', methods=["post", "get"])
def loginpage():

    id = request.form.get('id')
    if id != None:
        global real_id
        real_id = selectID(id)

    Error = None
    pwd = request.form.get('pwd')
    db_cnt = db_count()[0]['COUNT(*)']
    db = select()

    if id != None and pwd != None:
        for count in range(db_cnt):
            # id not exist error
            Error = "ID does not exist"
            if id not in db[count]['ID']:
                pass
            # password diff error
            elif db[count]['PWD'] != pwd:
                Error = "Password does not match"
                break
            # login success
            else:
                login = True
                return render_template("main.html",
                                       date=nowDatetime, login=login, roomList=roomList, id=real_id)
    return render_template("login.html", Error=Error)


@app.route('/signin', methods=["post", "get"])
def sign_in_page():

    id = request.form.get('id')

    sign_idCheck(id) # 아이디 중복체크

    # 아이디 사용가능

    pwd = request.form.get('pwd')
    name = request.form.get('name')
    if id != None:
        insert(id, pwd, name)
    return render_template('signin.html')


# {/id={room.id}}
@app.route('/todolist')
def todopage():
    return render_template("todolist.html")

@app.route('/emailCheck', methods=['POST'])
def emailCheck():
    # data를 기준으로 데이터베이스에  있는지 확인 후 있으면 response에 false, 없으면 true를 넣어 줌

    data = request.get_json()
    id = data['email']
    global response
    response = 'true' # js로 넘어갈 값이기 때문에 소문자 true반환

    response = emailTypeCheck(id) # 정규식 체크

    response = email_idCheck(id) # id중복체크

    return jsonify(ok = response)




def searchByWord(word):
    word = word.lower()
    results = []
    for room in selectroom():
        if word in room['title'].lower():
            results.append(room)
    return results


########### connect DB
todo_db = pymysql.connect(
    user='root',
    passwd='jj123100!!',
    # passwd='5180',
    host='127.0.0.1',
    # host='mysql',
    db='todolist',
    charset='utf8',
)
# default는 tuple, Dictcurser는 dict
cursor = todo_db.cursor(pymysql.cursors.DictCursor)


def select():
    sql = "SELECT * FROM `MEMBER`;"
    cursor.execute(sql)  # send query
    result = cursor.fetchall()  # get result
    return result

def selectroom():
    sql = "SELECT * FROM `roomlist`;"
    cursor.execute(sql)  # send query
    result = cursor.fetchall()  # get result
    return result



def insert(id, pwd,name):
    sql = f"INSERT INTO `MEMBER`(ID, PWD, NAME) VALUES ('{id}', '{pwd}', '{name}');"
    cursor.execute(sql)
    todo_db.commit()

def addRoom(host, title):
    sql = f"INSERT INTO roomlist(host, title) VALUES ('{host}', '{title}');"
    cursor.execute(sql)
    todo_db.commit()


def db_count():
    sql = "SELECT COUNT(*) FROM `MEMBER`;"
    cursor.execute(sql)
    result = cursor.fetchall()
    return result


def db_get_id():
    sql = "SELECT ID FROM `MEMBER`;"
    cursor.execute(sql)
    m_id = cursor.fetchall()
    return m_id

def emailTypeCheck(id):
    p = re.compile('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$') # 이메일 정규식
    reg = p.match(id) != None # 정규식 체크
    if (reg == False):
            response = 'false'
            return response

def email_idCheck(id):

    sql = f"SELECT ID FROM `MEMBER` WHERE ID = '{id}';"
    cursor.execute(sql)
    result = cursor.fetchone()
    if (result != None):
        response = 'false'
        return response
    else:
        response = 'true'
        return response


def sign_idCheck(id):
    sql = f"SELECT ID FROM `MEMBER` WHERE ID = '{id}';"
    cursor.execute(sql)
    result = cursor.fetchone()

    if (result != None): # 아이디가 없으면
       pass
    else:
        return


def selectID(id):
    sql = f"SELECT NAME FROM `MEMBER` WHERE id = '{id}';"
    cursor.execute(sql)  # send query
    result = cursor.fetchall()[0]['NAME']  # get result
    return result



app.run(host='127.0.0.1', debug=True)

