from flask import *
import datetime

app = Flask("ToDO")
db={'test':'1234','test2':'5678'}
nowDatetime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
roomList = [{'title':'room1','id':"host1"},{'title':'room2','id':"host2"}]   # Query = select title from roomList

@app.route('/')
def mainpage():
    # link = "/login"
    # link_tag = "Log In"
    # msg = "Please log in first"
    login=False
    if not roomList:   # 빈 리스트는 false
        msg = "no room now. create first room!"
    # return render_template("main_need_login.html",
    #                        link = link, link_tag=link_tag,
    #                        date = nowDatetime,
    #                        roomList = roomList,
    #                        msg = msg)
    return render_template("main_need_login.html",login = login,date = nowDatetime,
                            roomList = roomList)

# /user={userid}
@app.route('/user')
def mainpageUsing():
    return render_template("main_logout.html")


# ID, PWD를 POST로 받아와서 DB 데이터와 대조
@app.route('/login',methods=["post","get"])
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
            # link = "/"
            # link_tag="Log Out"
            login = True
            return render_template("main_need_login.html",
                                   date=nowDatetime, login = login,roomList = roomList)
    return render_template("login.html",Error = Error)

@app.route('/signin')
def signinpage():
    return render_template("signin.html")


# {/{room list id}}
@app.route('/')
def todopage():
    return render_template("todolist.html")

app.run(host="127.0.0.1")
