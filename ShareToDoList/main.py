from flask import *
import datetime
import pymysql
import json


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
    db_cnt = db_count()[0]['COUNT(*)']
    db = select()
    if id != None and pwd != None:
        for count in range(db_cnt):
            # id not exist error
            if id not in db[count]['ID']:
                Error = "ID does not exist"
            # password diff error
            elif db[count]['PWD'] != pwd:
                Error = "Password does not match"
            # login success
            else:
                login = True
                return render_template("main.html",
                                       date=nowDatetime, login=login, roomList=roomList)
    return render_template("login.html", Error=Error)
  

@app.route('/signin', methods=["post", "get"])
def sign_in_page():
    notify = None
    db_cnt = db_count()[0]['COUNT(*)']
    db_id = db_get_id() # DB에서 ID가져오기
    id = request.form.get('id')
    for count in range(db_cnt):
        if id != db_id[count]['ID']:
            pass
        else:
            return redirect('/signin') # HTTP/1.1 302 => redirect말고 다른 방식을 사용하도록 방법 찾기
    pwd = request.form.get('pwd')
    if id != None:
        insert(id, pwd)
    # delete_none() # 자동으로 들어간 none 데이터 지우기
    return render_template('signin.html')


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

########### connect DB
todo_db = pymysql.connect(
    user='root',
    passwd='1234',
    host='127.0.0.1',
    db='todolist',
    charset='utf8'
)
# default는 tuple, Dictcurser는 dict
cursor = todo_db.cursor(pymysql.cursors.DictCursor)

def select():
    sql = "SELECT * FROM `member`;"
    cursor.execute(sql) # send query
    result = cursor.fetchall() # get result
    return result
  

def insert(id, pwd):
    sql = f"INSERT INTO member(ID, PWD) VALUES ('{id}', '{pwd}');"
    cursor.execute(sql)
    todo_db.commit()
    

def db_count():
    sql = "SELECT COUNT(*) FROM member;"
    cursor.execute(sql)
    result = cursor.fetchall()
    return result
  

def db_get_id():
    sql = "SELECT ID FROM member;"
    cursor.execute(sql)
    m_id = cursor.fetchall()
    return m_id
  
  
def delete_none():
    sql = "DELETE FROM member WHERE ID = 'None';"
    cursor.execute(sql)
    todo_db.commit()

# def get_json():
#     cursor.execute("SELECT * FROM member")
#     data = cursor.fetchall()
#     for e in data:
#         print(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '), default=str))


app.run(host='127.0.0.1', debug=True)


