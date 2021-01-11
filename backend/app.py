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
    cursor.execute("SELECT * FROM users WHERE name='" + username + "';")
    if cursor.rowcount != 0: # if user already exists, i.e. there's a row with that user
        abort(406)
        return 406
    cursor.execute("INSERT INTO users (name) VALUES ('" + username + "');")
    connection.commit()
    return {'success': True}

# verifies user and sends userID to the frontend
@app.route('/verifyUser', methods=['POST'])
def verifyUser():
    content = request.json # extracts things from json request ('body' in frontend)
    username = content.get('username') # extracts only username from frontend, which is stored as value
    cursor.execute("SELECT * FROM users WHERE name='" + username + "';")
    if cursor.rowcount != 1: # if user doesn't exist, i.e. there's not exactly 1 row for that user
        abort(401)
        return 401

    userID = cursor.fetchone()[0] # fetch user id

    return {'success': True, 'userID': userID}

@app.route('/getAllItems', methods=['GET'])
def getAllItems():
    content = request.json
    cursor.execute("SELECT * FROM items")
    # retrieve every row in 'items' table
    rows = cursor.fetchall()
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

    dictItems = dict()
    dictItems['allItems'] = listOfDicts

    return dictItems

@app.route('/addItem', methods=['POST'])
def addItem():
    content = request.json
    # extracting info from frontend, which has 'name', 'description', etc. as keys and returns values of those keys.
    itemName = "'" + (content.get('item')).get('name') + "',"
    description = "'" + (content.get('item')).get('description') + "',"
    price = "'" + (content.get('item')).get('price') + "',"
    quantity = "'" + (content.get('item')).get('quantity') + "',"
    sellerID = "'" + (content.get('item')).get('sellerID') + "',"
    dateListed = "'" + content.get('dateListed') + "'"
    cursor.execute("INSERT INTO items (item_name, description, price, seller_id, quantity, date_listed)"
                   "VALUES (" + itemName + description + price + sellerID + quantity + dateListed + ")")
    connection.commit()
    return {'success': True}

@app.route('/addBid', methods=['POST'])
def addBid():
    content = request.json

    # extracting info from frontend
    quantity = "'" + (content.get('bidInfo')).get('quantity') + "'"
    bidderID = "'" + str(content.get('bidderID')) + "'"
    bidPrice = "'" + (content.get('bidInfo')).get('bidPrice') + "'"
    itemID = (content.get('itemID'))
    bidDate = "'" + content.get('bidDate') + "'"

    # get to and retrieve quantity of that item from db to check quantity available
    cursor.execute("SELECT quantity FROM items WHERE id=" + itemID + ";")
    quantAvailable = int(cursor.fetchall()[0][0])

    itemID = "'" + itemID + "'"

    quant = int((content.get('bidInfo')).get('quantity'))

    # retrieve username
    cursor.execute("SELECT name FROM users WHERE id=" + bidderID + ";")
    bidderName = cursor.fetchone()[0]

    if quant > 0 and quant <= quantAvailable: # if quant makes sense, add info to 'bid' table
        cursor.execute('INSERT INTO "bids"("item_id", "bidder_id", "bid_price", "quantity", "bid_date") '
                       'VALUES({}, {}, {}, {}, {})'.format(itemID, bidderID, bidPrice, quantity, bidDate))
        def addNotification(bidQuant, bidderIDStr, itemID, bidderName):

            # get to and retrieve info of that item from 'items' table
            cursor.execute("SELECT * FROM items WHERE id=" + itemID + ";")
            fetchResult = cursor.fetchone()

            # fetching specific info of the item
            itemName = fetchResult[1]
            priceListed = fetchResult[3]
            sellerID = fetchResult[4]

            bidPrice = (content.get('bidInfo')).get('bidPrice')

            notiMessage = "'" + bidderName + ' has put in a request to buy your item ' + itemName + ' for $' + bidPrice + "',"
            bidRequest = "'" + 'Bid Request' + "',"
            sent = "'" + 'sent' + "'"
            receiverID = "'" + sellerID + "',"
            senderID = "" + bidderIDStr + ","
            itemID = "" + itemID + ","

            cursor.execute("INSERT INTO notifications (notification_type, receiver_id, sender_id, item_id, message, status) "
                           "VALUES (" + bidRequest + receiverID + senderID + itemID + notiMessage + sent + ")")
        addNotification(quant, bidderID, itemID, bidderName)

    elif quant > quantAvailable:
        print("The quantity you requested is more than the amount the seller is selling.")

    connection.commit()
    return {'success': True}

@app.route('/getBidOffers', methods=['GET'])
def getBidOffers():
    content = request.json
    userID = "'" + str(content.get('userID')) + "'"
    cursor.execute("SELECT * FROM notifications WHERE receiver_id=" + userID + " OR sender_id=" + userID + ";")
    # retrieve every row in 'notifications' table that satisfies the WHERE condition above
    rows = cursor.fetchall()

    listOfDicts = []
    for row in rows:
        notiDict = dict()
        notiDict['notiID'] = row[0]
        notiDict['notiType'] = row[1]
        notiDict['receiverID'] = row[2]
        notiDict['senderID'] = row[3]
        notiDict['notiMessage'] = row[4]
        notiDict['notiStatus'] = row[5]
        notiDict['itemID'] = row[6]
        listOfDicts.append(notiDict)

    dictNotifications = dict()
    dictNotifications['allNotifications'] = listOfDicts

    return dictNotifications

@app.route('/getMyItems', methods=['POST'])
def getMyItems():
    content = request.json
    userID = "'" + str(content.get('userID')) + "'"
    cursor.execute("SELECT * FROM items WHERE seller_id=" + userID + " AND archived=FALSE;")
    rows = cursor.fetchall()

    # do nested for loop: for each item, get the bids
    listOfDicts = []
    for row in rows:
        itemId = row[0]
        myItemsDict = dict()
        myItemsDict['itemId'] = row[0]
        myItemsDict['itemName'] = row[1]
        myItemsDict['listQuant'] = row[6]
        myItemsDict['listPrice'] = row[3]
        myItemsDict['listDate'] = row[8]
        myItemsDict['resolved'] = row[7]

        cursor.execute("SELECT * FROM bids WHERE item_id='" + str(itemId) + "';")
        bids = cursor.fetchall()
        bidsList = []
        for bid in bids:
            currBid = dict()
            bidderId = bid[2]
            cursor.execute("SELECT * FROM users WHERE id=" + str(bidderId))
            firstBidderWithId = cursor.fetchone()
            currBid['bidder'] = firstBidderWithId[1]
            currBid['bidPrice'] = bid[3]
            currBid['bidQuant'] = bid[4]
            currBid['bidDate'] = bid[5]
            currBid['bidId'] = bid[0]
            bidsList.append(currBid)

        myItemsDict['bids'] = bidsList

        listOfDicts.append(myItemsDict)

    dictMyItems = dict()
    dictMyItems['allMyItems'] = listOfDicts
    # dictMyItems['notifications'] = getNotifications(userID)

    # return {'allMyItems': listOfDicts}
    return dictMyItems

@app.route('/updateMyListings', methods=['POST'])
def updateMyListings():
    dictMyItems = dict()
    content = request.json
    userID = "'" + str(content.get('userID')) + "'"
    cursor.execute("SELECT * FROM items WHERE seller_id=" + userID + " AND archived=FALSE;")
    try:
        updatedListings = cursor.fetchall()
    except psycopg2.ProgrammingError as error:
        dictMyItems['myUpdatedListings'] = []
        return dictMyItems

    # do nested for loop: for each item, get the bids
    listOfDicts = []
    for updatedListing in updatedListings:
        itemId = updatedListing[0]
        myItemsDict = dict()
        myItemsDict['itemId'] = updatedListing[0]
        myItemsDict['itemName'] = updatedListing[1]
        myItemsDict['listQuant'] = updatedListing[6]
        myItemsDict['listPrice'] = updatedListing[3]
        myItemsDict['listDate'] = updatedListing[8]
        myItemsDict['resolved'] = updatedListing[7]

        print("ITEM ID: ", str(itemId))

        bidsList = []
        try:
            cursor.execute("SELECT * FROM bids WHERE item_id='" + str(itemId) + "';")
            bids = cursor.fetchall()
            for bid in bids:
                currBid = dict()
                bidderId = bid[2]
                cursor.execute("SELECT * FROM users WHERE id=" + str(bidderId))
                firstBidderWithId = cursor.fetchone()
                currBid['bidder'] = firstBidderWithId[1]
                currBid['bidPrice'] = bid[3]
                currBid['bidQuant'] = bid[4]
                currBid['bidDate'] = bid[5]
                currBid['bidId'] = bid[0]
                bidsList.append(currBid)
        except psycopg2.ProgrammingError as error:
            pass

        myItemsDict['bids'] = bidsList

        listOfDicts.append(myItemsDict)

    dictMyItems['myUpdatedListings'] = listOfDicts

    return dictMyItems

@app.route('/saveBidResults', methods=['POST'])
def saveBidResults():
    content = request.json # this gets everything in frontend's 'body'
    bids = content.get('bids')
    archived = content.get('archived')
    dateArchived = "'" + content.get('archiveDate') + "'"
    itemId = content.get('itemId')
    itemId = str(itemId)

    # Updating 'rejected' and 'accept_quant' fields of 'bids' table
    for bid in bids:
        cursor.execute("UPDATE bids SET rejected=TRUE WHERE id=" + str(bid['bidId']) + " AND " + str(bid['rejected']) + "=TRUE;")
        cursor.execute("UPDATE bids SET rejected=FALSE WHERE id=" + str(bid['bidId']) + " AND " + str(bid['rejected']) + "=FALSE;")
        if (bid['acceptQuant'] != '' and int(bid['acceptQuant']) > 0): # accept quant is valid
            cursor.execute("UPDATE bids SET accept_quant=" + str(bid['acceptQuant']) + " WHERE id=" + str(bid['bidId']) + ";")

    if (archived == True):
        cursor.execute("UPDATE items SET archived=TRUE WHERE id=" + itemId + ";")
        cursor.execute("UPDATE items SET date_archived=" + dateArchived + " WHERE id=" + itemId + ";")

    connection.commit()
    return {}

@app.route('/updateQuantRemaining', methods=['POST'])
def updateQuantRemaining():
    content = request.json
    itemId = content.get('itemId')
    itemId = str(itemId)
    bids = content.get('bids')
    userID = "'" + str(content.get('userID')) + "'"

    cursor.execute("SELECT * FROM bids WHERE item_id='" + itemId + "';")
    bids = cursor.fetchall()
    # print("bids: ", bids)
    bidsList = []
    for bid in bids:
        if (bid[7] != None and int(bid[7]) > 0): # accept quant is valid
            cursor.execute("SELECT quantity FROM items WHERE id=" + itemId + ";")
            listingQuant = cursor.fetchone()[0]
            remainingQuant = int(listingQuant) - int(bid[7])
            cursor.execute("UPDATE items SET quantity="+ str(remainingQuant) + ";")
        currBid = dict()
        bidderId = bid[2]
        cursor.execute("SELECT * FROM users WHERE id=" + str(bidderId))
        firstBidderWithId = cursor.fetchone()
        currBid['bidder'] = firstBidderWithId[1]
        currBid['bidPrice'] = bid[3]
        currBid['bidQuant'] = bid[4]
        currBid['bidDate'] = bid[5]
        currBid['bidId'] = bid[0]
        bidsList.append(currBid)

    cursor.execute("SELECT * FROM items WHERE seller_id=" + userID + " AND archived=FALSE;")
    listings = cursor.fetchall()
    listOfDicts = []
    for listing in listings:
        itemId = listing[0]
        myItemsDict = dict()
        myItemsDict['itemId'] = listing[0]
        myItemsDict['itemName'] = listing[1]
        myItemsDict['listQuant'] = listing[6]
        myItemsDict['listPrice'] = listing[3]
        myItemsDict['listDate'] = listing[8]

        myItemsDict['bids'] = bidsList

        listOfDicts.append(myItemsDict)

    dictMyItems = dict()
    dictMyItems['myUpdatedListings'] = listOfDicts

    return dictMyItems


@app.route('/getArchives', methods=['POST'])
def getArchives():
    content = request.json
    userID = "'" + str(content.get('userID')) + "'"
    cursor.execute("SELECT * FROM items WHERE seller_id=" + userID + " AND archived=TRUE")
    archivedItems = cursor.fetchall()

    # do nested for loop: for each item, get the bids
    archivedItemsList = []
    for archivedItem in archivedItems:
        myArchivedItems = dict()
        myArchivedItems['itemId'] = archivedItem[0]
        myArchivedItems['itemName'] = archivedItem[1]
        myArchivedItems['listPrice'] = archivedItem[3]
        myArchivedItems['buyerId'] = archivedItem[5]
        myArchivedItems['listQuant'] = archivedItem[6]
        myArchivedItems['listDate'] = archivedItem[8]
        myArchivedItems['archiveDate'] = archivedItem[9]
        cursor.execute("UPDATE items SET archive_status='Sold' WHERE seller_id=" + userID + " AND archived=TRUE" + ";")
        connection.commit()
        myArchivedItems['archiveStatus'] = archivedItem[10]

        itemId = archivedItem[0]
        cursor.execute("SELECT * FROM bids WHERE item_id='" + str(itemId) + "';")
        bids = cursor.fetchall()

        bidsList = []
        for bid in bids:
            currBid = dict()

            bidderId = bid[2]
            cursor.execute("SELECT * FROM users WHERE id=" + str(bidderId))
            firstBidderWithId = cursor.fetchone()

            currBid['bidder'] = firstBidderWithId[1]
            currBid['bidPrice'] = bid[3]
            currBid['bidQuant'] = bid[4]
            currBid['bidDate'] = bid[5]
            currBid['bidId'] = bid[0]
            bidsList.append(currBid)

        myArchivedItems['bids'] = bidsList

        archivedItemsList.append(myArchivedItems)

    archivedItemsDict = dict()
    archivedItemsDict['allArchivedItems'] = archivedItemsList

    return archivedItemsDict











if __name__ == '__main__':
    app.run(debug=True)