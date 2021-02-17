import os
from flask import Flask, render_template, request, redirect, send_file

app = Flask("ToDO")

@app.route('/')
def mainpage():
    return render_template("main_need_login.html")

# /user={userid}
@app.route('/user')
def mainpageUsing():
    return render_template("main_logout.html")

@app.route('/login')
def loginpage(id,pwd):
    Error = None
    if id not in db:
        Error = "ID does not exist"
    elif db[id]!=pwd:
        Error = "Password does not match"
    return render_template("login.html")

@app.route('/signin')
def signinpage():
    return render_template("signin.html")
# {/{room list id}}
@app.route('/')
def todopage():
    return render_template("todolist.html")

db={}
def isExsist(id,pwd):
    Error = None
    if id not in db:
        Error = "ID does not exist"
        return Error
    elif db[id]!=pwd:
        Error = "Password does not match"
        return Error
    else: return render_template()


app.run(host="127.0.0.1")

