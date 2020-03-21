# coding=utf-8
from flask import Flask, request, abort
from flask_restful import Resource, Api
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

connection = psycopg2.connect(user = "titapapunne",
                              password = "",
                              host = "127.0.0.1",
                              port = "5432",
                              database = "titapapunne")

cursor = connection.cursor()
# Print PostgreSQL Connection properties
# print ( connection.get_dsn_parameters(),"\n")

class HelloWorld(Resource):
    def post(self):
        content = request.json # extracts things from json request
        username = content.get('username') # extracts only username, which is stored as value
        print(username)
        cursor.execute("SELECT * FROM table_1 WHERE name='" + username + "';")
        if cursor.rowcount != 0:
            abort(406)
            return 406
        cursor.execute("INSERT INTO table_1 (name) VALUES ('" + username + "');")
        connection.commit()
        return 200


api.add_resource(HelloWorld, '/submitUser')

if __name__ == '__main__':
    app.run(debug=True)