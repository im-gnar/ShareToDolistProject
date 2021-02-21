from flask import *
import datetime
import pymysql

app = Flask("ToDO", static_url_path='/static')  # static 폴더 참조
db = {'test@naver.com': '1234','test2@naver.com': '5678'}
# [{'id':'id1', 'pwd':'pwd1'},{'id':'id2','pwd':'pwd2'}]
nowDatetime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
roomList = [{'id':1,'title':'room1','host':"host1"},{'id':2,'title':'room2','host':"host2"}]
# Query = select * from roomList -> dict형으로 변환
# 어떤 식으로 들어오나?



@app.route('/',methods=["post","get"])
def mainpage():
    login=False
    word = request.form.get("roomsearch")
    print(word)
    if word!=None:
        login=True
        resroomList = searchByWord(word)
        return render_template("main.html",login = login,date = nowDatetime,
                            roomList = resroomList)
    return render_template("main.html",login = login,date = nowDatetime,
                            roomList = roomList)



# ID, PWD를 POST로 받아와서 DB 데이터와 대조
@app.route('/login', methods=["post", "get"])
def loginpage():
    Error = None
    id = request.form.get('id')  # 초기값 = None
    pwd = request.form.get('pwd')

    if id!=None and pwd!=None:
        # id not exist error
        if id not in db.keys():
            Error = "ID does not exist"
        # password diff error
        elif db[id]!=pwd:
            Error = "Password does not match"
        # login success
        else:
            login = True
            return render_template("main.html",
                                   date=nowDatetime, login=login, roomList=roomList)
    return render_template("login.html", Error=Error)


@app.route('/signin', methods=["post", "get"])
def id_check():
    notify = None
    id = request.form.get('id')
    pwd = request.form.get('pwd')
    if id in db.keys():
        notify = "다른 아이디를 사용해주세요"
    else:
        notify = "사용 가능한 아이디입니다."
    return render_template("/signin.html", notify=notify)

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


####### DB test
# connect DB
todo_db = pymysql.connect(
    user='root',
    passwd='jj123100!!',
    host='127.0.0.1',
    db='todolist',
    charset='utf8'
)
# default는 tuple, Dictcurser는 dict
cursor = todo_db.cursor(pymysql.cursors.DictCursor)

def select():
    sql = "SELECT * FROM `test`;"
    cursor.execute(sql)           # send query
    result = cursor.fetchall()    # get results
    return result

def insert():
    sql = '''INSERT INTO `test` 
        VALUES (7, '1', '서울특별시', 6);'''
    cursor.execute(sql)
    todo_db.commit()

insert()
print(select())

# def delete():
#     sql = '''DELETE FROM `busan-jibun`
#       WHERE `법정동코드` IS NULL;'''
#     cursor.execute(sql)
#     juso_db.commit()


# app.run(host="127.0.0.1",debug=True)
