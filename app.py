from abc import abstractproperty
from datetime import date, datetime, time
from logging import error
from flask import Flask, render_template, url_for, request, redirect, session, flash
from flask_sqlalchemy import SQLAlchemy
import datetime
from functools import wraps
from randomThreeName import get_three_random_nouns
import bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

global current_user
current_user = ""
app.secret_key = "HALLO"


# login required decorator
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for("login_page"))
    return wrap

# chat_key required decorator
def chat_key_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'chat_key' in session:
            return f(*args, **kwargs)
        else:
            flash('You need a chat-key first.')
            return redirect(url_for("chat_key_page"))
    return wrap


state = []

class ChatMessage(db.Model):
    __tablename__ = 'chat_message'
    id = db.Column(db.Integer, primary_key=True)
    chatkey = db.Column(db.String(256), db.ForeignKey('chat_key.chatkey'), nullable=False)
    user = db.Column(db.String(256), db.ForeignKey('chat_user.user'), nullable=False)
    text = db.Column(db.String(256))
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())

class ChatUser(db.Model):
    __tablename__ = 'chat_user'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(256))
    password = db.Column(db.String(256), nullable=False)

class ChatKey(db.Model):
    __tablename__ = 'chat_key'
    id = db.Column(db.Integer, primary_key=True)
    chatkey = db.Column(db.String(256))


@app.route('/')
def start_page():
    return render_template('index.html')


@app.route("/login", methods=["GET", "POST"])
def login_page():
    error = None
    if request.method == "POST":
        try:
            if bcrypt.checkpw(request.form["password"], ChatUser.query.filter_by(user = request.form["username"]).all()[1].password):
            # if True:
                session['logged_in'] = [request.form["username"], bcrypt.hashpw(request.form["password"], bcrypt.gensalt( 12 ))]
                print(session['logged_in'])
                print(ChatUser.query.all())
                print()
                return redirect(url_for("chat_page"))
            else:
                error = "Invalid credentials. Please try again."
        except IndexError:
            print("hi")
    return render_template("login.html")


@app.route("/logout")
def logout_page():
    session.pop('logged_in', None)
    session.pop('chat_key', None)
    return redirect(url_for("login_page"))


@app.route("/chat_key", methods=["GET", "POST"])
@login_required
def chat_key_page():
    error = None
    session.pop('chat_key', None)
    if request.method == "POST":
        if request.form["chat_key"] == "test":
            session['chat_key'] = request.form["chat_key"]
            return redirect(url_for("chat_page"))
    return render_template("chat_key.html")


@app.route('/chat')
@login_required
@chat_key_required
def chat_page():
    message_list = ChatMessage.query.all()
    return render_template('chat.html', message_list=message_list)


@app.route("/send", methods=["POST"])
def clickedSend():
    # add new message
    text = request.form.get("new_message")
    new_message(text)
    return redirect(url_for("chat_page"))

def new_message(text):
    new_message = ChatMessage(
        chatkey = session["chat_key"],
        user = session["logged_in"][0],
        text = text,
    )
    db.session.add(new_message)
    db.session.commit()



if __name__ == "__main__":
    # db.create_all()

    # new_user = ChatUser(
    #     user = "admin",
    #     password = bcrypt.hashpw("admin", bcrypt.gensalt( 12 ))
    # )
    # db.session.add(new_user)
    # db.session.commit()

    # new_chat_key = ChatKey(
    #     chatkey = "TIT20"
    # )
    # db.session.add(new_chat_key)
    # db.session.commit()

    # new_message = ChatMessage(
    #     chatkey = ChatKey.query.first().chatkey,
    #     user = ChatUser.query.filter_by(user='admin').first().user,
    #     text = "testtext",
    # )

    
    # db.session.add(new_message)
    # db.session.commit()

    app.run(debug=True)