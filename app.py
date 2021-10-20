from datetime import date, datetime, time
from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

global current_user
current_user = ""



state = []

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chatkey = db.Column(db.String(256))
    user = db.Column(db.String(256))
    text = db.Column(db.String(256))
    timestamp = db.Column(db.Date)


@app.route('/')
def start_page():
    return render_template('index.html')


@app.route('/chat')
def chat_page():
    message_list = ChatMessage.query.all()
    return render_template('chat.html', message_list=message_list)


@app.route("/insertusername", methods=["POST"])
def insertedUsername():
    print("insertedUsername()")
    global current_user
    current_user = request.form.get("username")
    print(current_user)
    return redirect(url_for("chat_page"))


@app.route("/send", methods=["POST"])
def clickedSend():
    # add new message
    text = request.form.get("new_message")
    print("clickedSend")
    new_message(text)
    return redirect(url_for("chat_page"))

def new_message(text):
    new_message = ChatMessage(
        chatkey = "TIT20",
        user = current_user,
        text = text,
        timestamp = date.today()
    )
    db.session.add(new_message)
    db.session.commit()



if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)