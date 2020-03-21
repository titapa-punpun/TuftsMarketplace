from flask import Flask, request
from flask_restful import Resource, Api
import psycopg2

app = Flask(__name__)
api = Api(app)

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
        cursor.execute("INSERT INTO table_1 (name) VALUES ('" + username + "');")
        connection.commit()
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/submitUser')

if __name__ == '__main__':
    app.run(debug=True)