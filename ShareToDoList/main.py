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

    return render_template("login.html")

@app.route('/signin')
def signinpage():
    return render_template("signin.html")
# {/{room list id}}
@app.route('/')
def todopage():
    return render_template("todolist.html")



app.run(host="127.0.0.1")

