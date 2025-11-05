import os
import requests

from flask import Flask, render_template, request, redirect, session
from flask_socketio import SocketIO, emit
from flask_session import Session

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
ch_list = ['Main']
users = ['admin']
channels = {}
channels['Main'] = []
room = "Main"
msg_count = 0

@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("home.html", ch_list=ch_list, chan_name="Main")

@app.route("/login", methods=["POST", "GET"])
def login():
    session.clear()
    usr = ""
    return render_template("index.html")

@socketio.on('submit login')
def submit_login(data):
    usr = data["user"]
    if usr not in users:
        users.append(usr)
        emit("add user", {'usr': usr}, broadcast=False)
    else:
        emit("alert", {'alert': 'This user already exixts!'}, broadcast=False)

@socketio.on('create channel')
def create_channel(data):
    ch = data["ch_name"]
    if ch not in ch_list:
        ch_list.append(ch)
        channels[ch]=[]
        emit("add channel", {'ch': ch}, broadcast=True)
        emit("success", {'success': 'Channel created!'}, broadcast=False)

    else:
        emit("success", {'success': 'This channel already exists!'}, broadcast=False)

@socketio.on('submit message room')
def submit_message_room(data):
    global room
    global msg_count
    msg_count += 1
    room = data["room"]
    msg = data["message"]
    message={'text':msg,'username':data['user'], 'time':data["ts"], 'id':msg_count}
    channels[data["room"]].append(message)

    if len(channels[data["room"]]) == 100:
        channels[data["room"]].pop(0)

    emit("send to room", {'message':msg, 'room':room, 'user':data['user'], 'time':data['ts'], 'id':msg_count}, broadcast=True)

@socketio.on('change room')
def change_room(data):
    for i in channels[data["room"]]:
        text = (i.get('text'))
        room = data["room"]
        user = (i.get('username'))
        time = (i.get('time'))
        id = (i.get('id'))
        emit("changed room", {'text':text, 'room':room, 'user':user, 'time':time, 'id':id}, broadcast=False)

@socketio.on('remove message')
def remove_message(data):
    id = data["id"]
    message={'text':data['text'], 'username':data['user'], 'time':int(data['time']), 'id':int(id)}
    if message in channels[data["room"]]:
        channels[data["room"]].remove(message)
    emit("removed", {'id':id}, broadcast=True)

@socketio.on('send success')
def send_success(data):
    emit("success", {'success':data["success"]}, broadcast=True)
