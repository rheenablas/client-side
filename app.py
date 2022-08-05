from flask import Flask, render_template, request, session, redirect, g, make_response, url_for
from forms import RegistrationForm, LoginForm
from database import close_db, get_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from random import randint
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

#make an option to still save even though not logged in---session


@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id", None)

def login_required(view):
    @wraps(view)                       
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url)) 
        return view(**kwargs)
    return wrapped_view

@app.teardown_appcontext
def close_db_at_end_of_requests(e=None):
    close_db(e)

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password.data
        password2 = form.password2.data
        db = get_db()
        if  db.execute("""SELECT * FROM users    
                            WHERE user_id = ?""", (user_id,)).fetchone() is not None:
                form.user_id.errors.append("User id used already")
        else:
            db.execute("""INSERT INTO users
                        VALUES (?, ?);""", (user_id, generate_password_hash(password)))
            db.commit()
            return redirect(url_for("login"))
    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password.data
        db = get_db()
        user = db.execute('''SELECT * FROM users
                   WHERE user_id = ?; ''', (user_id,)).fetchone()
        if user is None:
            form.user_id.errors.append("Unknown user id.")
        elif not check_password_hash(user['password'], password):   
            form.password.errors.append("Incorrect password!")
        else:
            #session.clear()
            session["user_id"] = user_id
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    tempUser = ''
    if g.user is None:
        if request.cookies.get('user') == None:
            user = f"guest{randint(0,1000)}"
            cookie = make_response(render_template('game.html'))
            cookie.set_cookie('user', user, max_age=24*60*60*18)
            return cookie
        tempUser = request.cookies.get('user')
    return render_template('game.html', tempUser=tempUser)

@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/store_score', methods=['POST']) #only accepts post - dont want to
def store_score():
    score = int(request.form["score"])
    people = int(request.form['sanc'])
    kills = int(request.form['kills'])
    date = datetime.now()
    db = get_db()
    if g.user != None:
        #UPDATES
        db.execute('''INSERT INTO recent VALUES (?, ?, ?, ?, ?); ''', (g.user, date, score, kills, people))
        db.commit()
        db.execute('''INSERT INTO scoreboard VALUES (?, ?, ?, ?);''', (g.user, score, kills, people))
        db.commit()
        db.execute('''INSERT INTO kills VALUES (?, ?);''', (g.user, kills))
        db.commit()
        db.execute('''INSERT INTO saved VALUES (?, ?);''', (g.user, people))
        db.commit()
    #IF G.USER IS NONE:
    else:
        user = request.cookies.get('user')
        db.execute('''INSERT INTO recent VALUES (?, ?, ?, ?, ?); ''', (user, date, score, kills, people))
        db.commit()
        db.execute('''INSERT INTO scoreboard VALUES (?, ?, ?, ?);''', (user, score, kills, people))
        db.commit()
        db.execute('''INSERT INTO kills VALUES (?, ?);''', (user, kills))
        db.commit()
        db.execute('''INSERT INTO saved VALUES (?, ?);''', (user, people))
        db.commit()        
    #if update is successful return success, otherwise return failure
    #store score at g.user---login code
    return "success"

@app.route('/score') 
def score():
    db = get_db()
    return render_template('score.html')

@app.route('/recent') 
def recent():
    db = get_db()
    wins = db.execute('''SELECT * FROM recent 
            ORDER BY date DESC LIMIT 15;''').fetchall()
    return render_template('recent.html', wins=wins)

@app.route('/scoreboard') 
def scoreboard():
    db = get_db()
    wins = db.execute('''SELECT * FROM scoreboard 
            ORDER BY score DESC, saved DESC, kills DESC LIMIT 10;''').fetchall()
    return render_template('scoreboard.html', wins=wins)
    
@app.route('/saved') 
def saved():
    db = get_db()
    wins = db.execute('''SELECT * FROM saved 
            ORDER BY score DESC LIMIT 5;''').fetchall()
    return render_template('saved.html', wins=wins)

@app.route('/kills') 
def kills():
    db = get_db()
    wins = db.execute('''SELECT * FROM kills 
            ORDER BY score DESC LIMIT 5;''').fetchall()
    return render_template('kills.html', wins=wins)
    
'''
@app.route("/", methods=['GET', 'POST'])
def __():
    if request.method == "GET":

        return render_template(".html")
    else:
        
        return render_template(".html")
'''

