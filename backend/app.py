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
    if cursor.rowcount != 0: # if user already exists, i.e. there's a row with that user
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
    if cursor.rowcount != 1: # if user doesn't exist, i.e. there's not exactly 1 row for that user
        abort(401)
        return 401
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

@app.route('/addItem', methods=['POST'])
def addItem():
    content = request.json
    # extracting info from frontend, which has 'name', 'description', etc. as keys and returns values of those keys.
    itemName = "'" + (content.get('item')).get('name') + "',"
    description = "'" + (content.get('item')).get('description') + "',"
    price = "'" + (content.get('item')).get('price') + "',"
    quantity = "'" + (content.get('item')).get('quantity') + "'"
    sellerID = "'" + (content.get('item')).get('sellerID') + "',"
    cursor.execute("INSERT INTO items (item_name, description, price, seller_id, quantity) "
                   "VALUES (" + itemName + description + price + sellerID + quantity + ")")
    connection.commit()
    return {'success': True}

@app.route('/addBid', methods=['POST'])
def buyItem():
    content = request.json

    # extracting info from frontend
    quantity = "'" + (content.get('item')).get('quantity') + "'"
    bidderID = "'" + (content.get('item')).get('bidderID') + "',"
    bidPrice = "'" + (content.get('item')).get('bidPrice') + "',"
    itemID = (content.get('item')).get('itemID')

    # get to and retrieve quantity of that item from db to check quantity available
    cursor.execute("SELECT quantity FROM items WHERE id=" + itemID + ";")
    quantAvailable = int(cursor.fetchall()[0][0])
    print(quantAvailable)

    itemID = "'" + itemID + "'"

    print(quantity, bidderID, bidPrice, itemID)

    quant = int((content.get('item')).get('quantity'))

    if quant > 0 and quant <= quantAvailable:
        cursor.execute("INSERT INTO \"bids\"(\"item_id\", \"bidder_id\", \"bid_price\", \"quantity\") "
                       "VALUES(" + {}.format(itemID, bidderID, bidPrice, quantity) + ");")

        # cursor.execute("INSERT INTO \"bids\"(\"item_id\", \"bidder_id\", \"bid_price\", \"quantity\") "
        #                "VALUES(" + {}.format(itemID) + {}.format(bidderID) + {}.format(bidPrice) + {}.format(quantity) + ");")

    # elif quant > quantAvailable:
    #     print("Not enough of the item available.")

    connection.commit()
    return {'success': True}

    # if quantToBuy < quantExists --> do math

    # if quantToBuy > quantExists --> error

    # delete from 'items' table
    # cursor.execute("DELETE FROM items WHERE id='" + itemID + "';")



if __name__ == '__main__':
    app.run(debug=True)