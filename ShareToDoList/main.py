import os
from flask import *

app = Flask("ToDO")
db={'test':'1234'}


@app.route('/')
def mainpage():
    return render_template("main_need_login.html")

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
            return render_template("main_logout.html")
    return render_template("login.html",Error = Error)

@app.route('/signin')
def signinpage():
    return render_template("signin.html")


# {/{room list id}}
@app.route('/')
def todopage():
    return render_template("todolist.html")

app.run(host="127.0.0.1")

