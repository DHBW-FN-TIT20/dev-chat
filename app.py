from abc import abstractproperty
from datetime import date, datetime, time
from logging import error
from flask import Flask, render_template, url_for, request, redirect, session, flash
from flask_sqlalchemy import SQLAlchemy
import datetime
from functools import wraps
from randomThreeName import get_three_random_nouns
import bcrypt

# Set up FLASK app and SQLite database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key = "HALLO"


# Define SQL tables
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
    access = db.Column(db.Integer, default=0) # 0-User 1-Admin

class ChatKey(db.Model):
    __tablename__ = 'chat_key'
    id = db.Column(db.Integer, primary_key=True)
    chatkey = db.Column(db.String(256))

# Set decorators
# With this decorator, the site can only be accessed when logged in
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for("login_page"))
    return wrap

# With this decorator, the site can only be accessed if a chat key is currently used
def chat_key_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'chat_key' in session:
            return f(*args, **kwargs)
        else:
            return redirect(url_for("chat_key_page"))
    return wrap


# With this decorator, the site can only be accessd if the user has admin (1) permission
def admin_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if ChatUser.query.filter_by(user = session['logged_in'][0]).first().access == 1:
            return f(*args, **kwargs)
        else:
            flash('You do not have permission to access this site.')
            return redirect(url_for("chat_key_page"))
    return wrap


# index.html
@app.route('/')
def start_page():
    return render_template('index.html')


# login.html
@app.route("/login", methods=["GET", "POST"])
def login_page():
    error = ""
    if request.method == "POST":
        if (request.form["username"] == ""):
            error = ""
        else:
            try:
                if bcrypt.checkpw(request.form["password"], ChatUser.query.filter_by(user = request.form["username"]).all()[0].password):
                    session['logged_in'] = [request.form["username"], bcrypt.hashpw(request.form["password"], bcrypt.gensalt( 12 ))]
                    return redirect(url_for("chat_page"))
                else:
                    error = "Invalid credentials. Please try again."
            except IndexError:
                error = "User does not exist. Please try again."
    flash(error)
    return render_template("login.html")


# create_user.html
@app.route("/create_user", methods=["GET", "POST"])
def create_user_page():
    error = None
    if request.method == "POST":
        if ChatUser.query.filter_by(user = request.form["new_username"]).all() == []:
            if request.form["new_password"] == request.form["new_password_confirm"]:
                new_user = ChatUser(
                    user = request.form["new_username"],
                    password = bcrypt.hashpw(request.form["new_password"], bcrypt.gensalt( 12 ))
                )
                db.session.add(new_user)
                db.session.commit()
                session['logged_in'] = [new_user.user, new_user.password]
                return redirect(url_for("chat_page"))
            else:
                error = "The entered passwords don't match"
        else:
            error = "The entered username exists already"
    return render_template("create_user.html")


@app.route("/logout")
def logout_page():
    session.pop('logged_in', None)
    session.pop('chat_key', None)
    return redirect(url_for("login_page"))


@app.route("/chat_key", methods=["GET", "POST"])
@login_required
def chat_key_page():
    is_admin = ChatUser.query.filter_by(user = session['logged_in'][0]).first().access == 1
    print(is_admin)
    error = None
    session.pop('chat_key', None)
    if request.method == "POST":
        if request.form["chat_key"] == "test":
            session['chat_key'] = request.form["chat_key"]
            return redirect(url_for("chat_page"))
        flash('You need a chat-key first.')
    return render_template("chat_key.html", is_admin=is_admin)


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


@app.route('/admin_settings')
@login_required
@admin_required
def admin_settings_page():
    user_list = ChatUser.query.all()
    return render_template("admin_settings.html", user_list=user_list)


@app.route('/delete_user', methods=["POST"])
@login_required
def delete_user():
    print(request.form.get("user_id"))
    ChatUser.query.filter_by(id=request.form.get("user_id")).delete()
    db.session.commit()
    # Maybe add confimation
    return redirect(url_for("admin_settings_page"))


if __name__ == "__main__":
    db.create_all()

    new_user = ChatUser(
        user = "admin",
        password = bcrypt.hashpw("admin", bcrypt.gensalt( 12 )),
        access = 1
    )
    db.session.add(new_user)
    db.session.commit()

    new_chat_key = ChatKey(
        chatkey = "TIT20"
    )
    db.session.add(new_chat_key)
    db.session.commit()

    # new_message = ChatMessage(
    #     chatkey = ChatKey.query.first().chatkey,
    #     user = ChatUser.query.filter_by(user='admin').first().user,
    #     text = "testtext",
    # )

    
    db.session.add(new_message)
    db.session.commit()

    app.run(host='0.0.0.0', port=80)