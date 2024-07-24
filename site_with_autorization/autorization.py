from datetime import datetime, timezone,date,timedelta

from flask import Flask, render_template, url_for, request, redirect, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user,logout_user
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from sqlalchemy.types import DateTime
import pytz

app = Flask(__name__, template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'somethinforsomething'
database = SQLAlchemy(app)

migrate = Migrate(app, database)

login_manager = LoginManager()
login_manager.init_app(app)

bcrypt = Bcrypt(app)


class Task(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    title = database.Column(database.String(100), nullable=False)
    description = database.Column(database.Text, nullable=False)
    deadline = database.Column(DateTime(timezone=True), nullable=False)
    user_id = database.Column(database.Integer, database.ForeignKey('user.id'), nullable=False)
    user = database.relationship('User', backref=database.backref('tasks', lazy=True))


class User(database.Model, UserMixin):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(20), nullable=False, unique=True)
    password = database.Column(database.String(80), nullable=False)


@login_manager.user_loader
def loader_user(user_id):
    return database.session.get(User, int(user_id))


'''начальная страница, от неё видет на регистарицю и на вход'''


@app.route('/')
def home_in_site():
    return render_template('home.html')


'''страница для входа'''


@app.route('/login', methods=["POST", 'GET'])
def login_in_site():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user_logging = User.query.filter_by(username=username).first()
        if user_logging and bcrypt.check_password_hash(user_logging.password, password):
            login_user(user_logging)
            return redirect(url_for('dash', id=user_logging.id))
        else:
            flash('Вы ввели неправильный логин или пароль', 'error')

    return render_template('login.html')


'''страница для регистрации'''


@app.route('/register', methods=["POST", 'GET'])
def register_in_site():
    if request.method == "POST":
        new_user = request.form.get("username")
        new_password = request.form.get("password")
        new_check_password = request.form.get("confirm_password")

        existing_user = User.query.filter_by(username=new_user).first()
        if existing_user:
            flash('Этот ник уже занят, попробуйте другой', 'error')

        elif new_check_password != '' and new_password == new_check_password and new_user != '':
            hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            add_new_user = User(username=new_user, password=hashed_password)
            database.session.add(add_new_user)
            database.session.commit()
            return redirect(url_for('login_in_site'))
        else:
            flash('Вы ввели неправильный повторный пароль или пустой логин, попробуйте ещё раз', 'error')

    return render_template('register.html')


@app.route('/dash/<int:id>')
@login_required
def dash(id):
    if id != current_user.id:
        flash("You do not have permission to access this page.", "error")
        return redirect(url_for('home_in_site'))
    return render_template('Dash.html', id=id)


@app.route('/tasks/<int:id>')
@login_required
def tasks(id):
    if id != current_user.id:
        flash("You do not have permission to access this page.", "error")
        return redirect(url_for('home_in_site'))
    return render_template('tasks.html', id=id)


@app.route('/cal/<int:id>')
@login_required
def cal(id):
    if id != current_user.id:
        flash("You do not have permission to access this page.", "error")
        return redirect(url_for('home_in_site'))
    return render_template('cal.html', id=id)




@app.route('/add_task', methods=['POST'])
@login_required
def add_task():
    data = request.json
    deadline_str = data['deadline']

    deadline = datetime.fromisoformat(deadline_str.replace('Z', '+00:00'))

    deadline = deadline.astimezone(timezone.utc).replace(tzinfo=None)

    new_task = Task(
        title=data['title'],
        description=data['description'],
        deadline=deadline,
        user_id=current_user.id
    )
    database.session.add(new_task)
    database.session.commit()
    return jsonify({'success': True}), 200

@app.route('/get_tasks')
@login_required
def get_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'deadline': task.deadline.isoformat()
    } for task in tasks]), 200


@app.route('/get_today_tasks')
@login_required
def get_today_tasks():
    today = date.today()
    tasks = Task.query.filter(
        Task.user_id == current_user.id,
        Task.deadline >= today,
        Task.deadline < today + timedelta(days=1)
    ).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'deadline': task.deadline.isoformat()
    } for task in tasks]), 200


@app.route('/get_latest_tasks')
@login_required
def get_latest_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.deadline.desc()).limit(5).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'deadline': task.deadline.isoformat()
    } for task in tasks]), 200



@app.route('/delete_task/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    database.session.delete(task)
    database.session.commit()
    return jsonify({'success': True}), 200


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home_in_site'))

def delete_user_by_username(username):
    with app.app_context():
        user_to_delete = User.query.filter_by(username=username).first()
        if user_to_delete:
            database.session.delete(user_to_delete)
            database.session.commit()
            return True
        else:
            return False


if __name__ == '__main__':
    app.run(debug=True)
