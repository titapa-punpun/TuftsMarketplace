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

@app.route('/submitUser', methods=['POST'])
def submitUser():
    content = request.json # extracts things from json request
    username = content.get('username') # extracts only username, which is stored as value
    print(username)
    cursor.execute("SELECT * FROM table_1 WHERE name='" + username + "';")
    if cursor.rowcount != 0:
        abort(406)
        return 406
    cursor.execute("INSERT INTO table_1 (name) VALUES ('" + username + "');")
    connection.commit()
    return {'success': True}

@app.route('/verifyUser', methods=['POST'])
def verifyUser():
    content = request.json # extracts things from json request ('body' in frontend)
    username = content.get('username') # extracts only username from frontend, which is stored as value
    print(username)
    cursor.execute("SELECT * FROM table_1 WHERE name='" + username + "';")
    if cursor.rowcount != 1:
        abort(401)
        return 401
    return {'success': True}

@app.route('/addItem', methods=['POST'])
def addItem():
    content = request.json
    itemName = "'" + content.get('itemName') + "',"
    description = "'" + content.get('description') + "',"
    price = "'" + content.get('price') + "',"
    sellerID = "'" + content.get('sellerID') + "',"
    quantity = "'" + content.get('quantity') + "'"
    cursor.execute("INSERT INTO items (item_name, description, price, seller_id, quantity) "
                   "VALUES (" + itemName + description + price + sellerID + quantity + ")")
    connection.commit()
    return {'success': True}

@app.route('/getAllItems', methods=['GET'])
def getAllItems():
    content = request.json
    cursor.execute("SELECT * FROM items")
    rows = cursor.fetchall()
    print("Rows: ", rows)
    listOfDicts = []
    for row in rows:
        itemDict = dict()
        itemDict['itemID'] = row[0]
        itemDict['itemName'] = row[1]
        itemDict['itemDescription'] = row[2]
        itemDict['itemPrice'] = row[3]
        itemDict['itemSellerID'] = row[4]
        itemDict['itemBuyerID'] = row[5]
        itemDict['itemQuantity'] = row[6]
        listOfDicts.append(itemDict)

    print(listOfDicts)

    dictItems = dict()
    dictItems['allItems'] = listOfDicts

    # connection.commit()
    return dictItems


# @app.route('/buyItem', methods=['POST'])
# def buyItem():
#     content = request.json
#     itemName = "'" + content.get('itemName') + "',"
#     quantity = "'" + content.get('quantity') + "'"
#     cursor.execute("INSERT INTO items (item_name, description, price, seller_id, quatity) "
#                    "VALUES (" + itemName + description + price + sellerID + quantity + ")")
#     connection.commit()
#     return {'success': True}




if __name__ == '__main__':
    app.run(debug=True)