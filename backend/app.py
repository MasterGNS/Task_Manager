from flask import Flask, request, jsonify, abort
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import re
import json
import asyncpg
from datetime import datetime, timedelta
from config import read_json
from coding import encode, data_frame
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
json_data = read_json()
app.config['JWT_SECRET_KEY'] = json_data["key"]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=10)
app.debug = True
jwt = JWTManager(app)


async def connect():
    try:
        conn = await asyncpg.connect(database=json_data["database"],
                                     user=json_data["user"],
                                     password=json_data["password"],
                                     host=json_data["host"],
                                     port=json_data["port"])
        if conn:
            print("Connecting sucsessfully")
        else:
            print("Failed to connect")
        return conn
    except:
        error = "failed to connect"
        return jsonify({"message": error})


@app.route('/registration', methods=['POST'])
async def create():
    try:
        connection = await connect()
        print(1)
        username = request.json.get("username")
        email = request.json.get("email")
        name = request.json.get("name")
        password = request.json.get("password")

        if len(username) < 4 or len(email) < 4 or len(password) < 8:
            return jsonify({"message": "Invalid length"})

        if not re.match("^[a-zA-Z0-9]+$", username):
            return jsonify({"message": "Invalid username"})

        if not all(re.match("^[a-zA-Z0-9]", c) for c in password):
            return jsonify({"message": "Invalid password"})

        if not all(re.match("^[a-zA-Z0-9@.]+$", c) for c in email):
            return jsonify({"message": "Invalid email"})

        password = encode(password)
        req = "INSERT INTO users (username, email, password, name) VALUES ($1, $2, $3, $4)"
        await connection.execute(req, username, email, password, name)
        await connection.close()
        print("Аккаунт создан")
        return jsonify({"message": "Created"})

    except:
        error = "failed to create"
        print(error)
        return jsonify({"message": error})


@app.route('/home/delete/<string:name>', methods=['DELETE'])
@jwt_required()
async def delete(name):
    try:
        username = get_jwt_identity()
        if username != name:
            abort(404)
        else:
            try:
                username = request.json.get('username')
                print(username)
                connection = await connect()
                req1 = "DELETE FROM users WHERE username = $1"
                req2 = "DELETE FROM tasks WHERE username = $1"
                await connection.execute(req1, name)
                await connection.execute(req2, name)
                await connection.close()
                return jsonify({"message": "Deleted"})
            except:
                error = "failed to delete"
                return jsonify({"message": error})
    except:
        error = "you don't logined"
        return jsonify(error)


@app.route('/refresh', methods=['POST'])
@jwt_required
def refresh_token():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify({'access_token': new_token}), 200


@app.route('/login', methods=['GET'])
async def login():
    try:
        username_entered = request.args.get('username')
        password_entered = encode(request.args.get('password'))
        connection = await connect()
        req = "SELECT * FROM users WHERE username = $1 AND password = $2"
        result = await connection.fetchrow(req, username_entered, password_entered)
        await connection.close()
        if result:
            token = create_access_token(identity=username_entered)
            print("Успешная Авторизация")
            return jsonify({"acsess_token": token})
        else:
            return jsonify({"message": "User not found"})
    except:
        error = "failed reading"
        return jsonify({"message": error})


@app.route("/home/update/<string:name>", methods=['PUT'])
@jwt_required()
async def update(name):
    try:
        username = get_jwt_identity()
        print(username, name)
        if username != name:
            abort(404)
        else:
            try:
                connection = await connect()
                data = request.get_json()
                username = data.get('username')
                password = data.get('password')
                email = data.get('email')
                json_name = data.get('name')
                if not username or not password or not email or not json_name:
                    return jsonify({'message': 'Empty field'})

                req1 = "UPDATE users SET username = $1, password = $2, email = $3, name = $4 WHERE username = $5"
                req2 = "UPDATE tasks SET username = $1, WHERE username = $2"
                await connection.execute(req1, username, encode(password), email, json_name, name)
                await connection.execute(req2, username, name)
                await connection.close()
                return jsonify({"message": "update success"})
            except Exception as e:
                error = "Хуйня: "
                return jsonify({"message": e.args})
    except Exception as err:
        error = "Залупа: "
        return jsonify({"message": err.args})


@app.route('/home/<string:name>', methods=['GET'])
@jwt_required()
async def home(name):
    try:
        username = get_jwt_identity()
        if username != name:
            abort(404)
        else:
            return jsonify(logged_in_as=username), 200
    except:
        error = "Invalid token"
        return jsonify({"message": error})


@app.route('/home/tasks/<string:name>', methods=['GET', 'PUT', 'POST', 'DELETE'])
@jwt_required()
async def tasks(name):
    try:
        username = get_jwt_identity()
        if username != name:
            abort(404)
        else:
            if request.method == 'GET':
                try:
                    connection = await connect()
                    req = "SELECT task, task_type, date::text AS formated_date FROM tasks WHERE username = $1"
                    result = await connection.fetch(req, name)
                    result = await data_frame(result)
                    await connection.close()
                    if result:
                        return jsonify(result)
                    else:
                        return jsonify({"message": "У вас нет задач!"})
                except:
                    error = "failure get tasks"
                    return jsonify({"message": error})

            elif request.method == "POST":
                try:
                    connection = await connect()
                    data = request.get_json()
                    task = data["task"]
                    task_type = data["task_type"]
                    date = datetime.strptime(data["date"], "%Y-%m-%d")
                    ddate = data['date']
                    print(date.date())
                    req = "SELECT task, task_type, date FROM tasks WHERE task = $1 AND task_type = $2 AND date = $3"
                    req_task = await connection.fetch(req, task, task_type, date)
                    print(req_task)
                    if req_task:
                        print("penis")
                        await connection.close()
                        return jsonify({'message': "task already exist"})
                    else:
                        req = "INSERT INTO tasks (username, task, task_type, date) VALUES ($1, $2, $3, $4)"
                        await connection.execute(req, name, task, task_type, date)
                        await connection.close()
                        return jsonify({'message': "success insert"})

                except:
                    return jsonify({"message":"failure add tasks"})

            elif request.method == "PUT":
                try:
                    connection = await connect()
                    data = request.get_json()
                    print(data)
                    new_task = data["new_task"]
                    new_task_type = data["new_task_type"]
                    new_date = datetime.strptime(data["new_date"], "%Y-%m-%d")
                    old_task = data["old_task"]
                    old_task_type = data["old_task_type"]
                    old_date = datetime.strptime(data["old_date"], "%Y-%m-%d")
                    print(new_task, new_task_type, old_task, old_task_type)
                    req = "UPDATE tasks SET task = $1, task_type = $2, date = $3 WHERE username = $4 AND task = $5 AND task_type = $6 AND date = $7"
                    await connection.execute(req, new_task, new_task_type, new_date, name, old_task, old_task_type, old_date)
                    await connection.close()
                    return jsonify({'message':"success update tasks"})
                except:
                    return jsonify({"message":"failure update tasks"})
            elif request.method == "DELETE":
                try:
                    connection = await connect()
                    date = request.json.get("date")
                    task = request.json.get("task")
                    task_type = request.json.get("task_type")
                    date = datetime.strptime(date, "%Y-%m-%d")
                    print(task, task_type, date)
                    req = "DELETE FROM tasks WHERE task = $1 AND task_type = $2 AND username = $3 and date = $4"
                    await connection.execute(req, task, task_type, name, date)
                    await connection.close()
                    return jsonify({"message": "success delete task"})
                except Exception as e:
                    error_message = f'Ошибка при удалении задачи: {str(e)}'
                    return jsonify({"message":error_message})
    except:
        error = "Invalid token"
        return jsonify({"message": error})