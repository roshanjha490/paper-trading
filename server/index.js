const {
    get_table_data_by_array,
    insert_data_in_table,
    run_raw_sql,
    update_data_in_table
} = require('./lib/db');

const crypto = require('crypto')

const request = require('request');

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const KiteTicker = require("kiteconnect").KiteTicker;

// Method defined for websocket
wss.on('connection', async function connection(ws) {

    let isClientConnected = true;

    let credential = await get_table_data_by_array({
        table_name: 'kite_credentials',
        where_array: {
            user_id: 1,
            is_expired: 0
        },
        order_by: 'id'
    })

    credential = credential[0][0]

    let ticker = new KiteTicker({
        api_key: credential.api_key,
        access_token: credential.access_token,
    });

    ticker.autoReconnect(false)

    ticker.connect();

    ticker.on("ticks", onTicks);

    ticker.on("connect", subscribe);

    ticker.on("connect", () => {
        console.log('Live Trade is running...')
    });

    ticker.on("noreconnect", function () {
        console.log("noreconnect");
    });

    ticker.on("reconnect", function (reconnect_count, reconnect_interval) {
        console.log("Reconnecting: attempt - ", reconnect_count, " interval - ", reconnect_interval);
    });

    ticker.on("disconnect", () => {

        if (isClientConnected) {
            console.log('Kite Disconnected Automatically In Live Trade')
        } else {
            console.log('Manual Disconnection CMD')
        }

    });

    ticker.on("close", () => {
        console.log('Closed Successfully')
    })

    function onTicks(ticks) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(ticks));
        }
    }

    let items = [408065];

    function subscribe() {
        ticker.subscribe(items);
        ticker.setMode(ticker.modeFull, items);
    }

    ws.on('message', function incoming(message) {

        console.log(message)

        ticker.unsubscribe(items);

        items = JSON.parse(message);

        ticker.subscribe(items);

        ticker.setMode(ticker.modeFull, items);
    });

    ws.on('close', function close() {
        console.log('Client disconnected');

        isClientConnected = false

        ticker.disconnect()

    });
});



// Creation of Server
server.listen(3001, function listening() {
    console.log('WebSocket server is listening on port 3001');
});




// Checking & Running StopLoss

let isMarketOpen = false;

async function checkStopLoss(api_key, access_token) {

    let items = [];

    let filteredTokens = [256265];

    let stopLossTicker = new KiteTicker({
        api_key: api_key,
        access_token: access_token,
    });

    stopLossTicker.autoReconnect(false);

    stopLossTicker.connect();

    stopLossTicker.on("ticks", onTicks);

    stopLossTicker.on("connect", subscribe);

    function subscribe() {
        unsubscribe()
        stopLossTicker.subscribe(filteredTokens);
    }

    function unsubscribe() {
        stopLossTicker.unsubscribe(filteredTokens);
    }

    stopLossTicker.on("connect", () => {
        console.log('Stop Loss Function is running...')
    });

    async function onTicks(ticks) {

        const executeStopLossPromises = await ticks.map(async tick => {

            const currentPriceObj = await items.find(item => item.instrument_token === tick.instrument_token);

            if (currentPriceObj && tick.last_price < currentPriceObj.stop_loss_amt) {

                let insert_order = await insert_data_in_table({
                    table_name: 'orders',
                    data: [{
                        instrument_token: currentPriceObj.instrument_token,
                        trading_symbol: currentPriceObj.trading_symbol,
                        exchange: currentPriceObj.exchange,
                        user_id: currentPriceObj.user_id,
                        order_type: 'SELL',
                        instrument_type: currentPriceObj.instrument_type,
                        sold_at: tick.last_price,
                        quantity_sold: currentPriceObj.remaining_quantity,
                        order_id: currentPriceObj.id
                    }]
                })

                if (insert_order && insert_order.length > 0 && insert_order[0].hasOwnProperty('insertId')) {

                    stopLossTicker.unsubscribe([tick.instrument_token]);

                    items = items.filter(item => item.instrument_token !== currentPriceObj.instrument_token);

                    return {
                        status: true,
                        response: JSON.stringify(insert_order),
                        message: 'Order Inserted Successfully',
                        client_message: 'Poisition Sold Successfully @₹' + tick.last_price,
                    }
                } else {
                    return {
                        status: false,
                        response: JSON.stringify(insert_order),
                        message: 'Order Not Inserted',
                        client_message: 'Server Error Occured',
                    }
                }

            } else {
                return {
                    status: false,
                    message: 'Stop Loss Not Hit',
                    client_message: 'Current Price is @₹' + tick.last_price + ' ' + tick.instrument_token,
                }
            }
        })

        const executeStopLossResults = await Promise.all(executeStopLossPromises);

        if (executeStopLossResults.status) {
            console.log(executeStopLossResults);
        }

    }

    async function getting_db_changes() {

        if (isMarketOpen) {
            items = await run_raw_sql("SELECT * FROM ( SELECT o1.*, o1.quantity_purchased - COALESCE(SUM(o2.quantity_sold), 0) AS remaining_quantity FROM orders o1 LEFT JOIN orders o2 ON o1.id = o2.order_id AND o2.order_type = 'SELL' WHERE o1.order_type = 'PUR' AND o1.is_stop_loss_amt = 1 GROUP BY o1.id ) AS subquery WHERE subquery.remaining_quantity > 0")

            items = items[0]

            unsubscribe()

            filteredTokens = await items.map(obj => obj.instrument_token);

            subscribe()
        } else {
            stopLossTicker.disconnect()
        }

    }

    let intervalId = setInterval(getting_db_changes, 3000)

    stopLossTicker.on("disconnect", () => {
        isMarketOpen = false;
        clearInterval(intervalId)
        console.log('Kite is Disconnected automatically in Stop Loss')
    });

    stopLossTicker.on("close", () => {
        isMarketOpen = false;
        console.log('Kite is closed automatically in Stop Loss')
    });

}


async function checkMarketStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if ((hours === 9 && minutes >= 15) || (hours > 9 && hours < 15) || (hours === 15 && minutes <= 30)) {

        if (!(isMarketOpen)) {
            const [[credential]] = await get_table_data_by_array({
                table_name: 'kite_credentials',
                where_array: {
                    user_id: 1,
                    is_expired: 0
                },
                order_by: 'id'
            })

            if (credential.is_expired === 1) {
                isMarketOpen = false;
                console.log('Kite Credentials Expired')
            }

            if (credential.is_expired === 0) {
                isMarketOpen = true;
                checkStopLoss(credential.api_key, credential.access_token)
            }
        }

    } else {
        isMarketOpen = false;
    }
}

setInterval(checkMarketStatus, 10000)


// Checking & Running StopLoss






// Updating CSV for Instruments

async function update_csv() {

    let credential = await get_table_data_by_array({
        table_name: 'kite_credentials',
        where_array: {
            user_id: 33,
            is_expired: 0
        },
        order_by: 'id'
    })

    // console.log(credential[0][0])

    let options = {
        'method': 'GET',
        'url': 'https://api.kite.trade/instruments',
        'headers': {
            'X-Kite-Version': '3',
            'Authorization': 'token ' + credential.api_key + ':' + credential.access_token,
            'Cookie': '_cfuvid=GMxyrsTtMm0rpogWXWzLM1jK__lcuZ7o8xqEPXHS19g-1713165799438-0.0.1.1-604800000'
        },
        form: {

        }
    };

    request(options, async function (error, response, csvData) {
        if (error) throw new Error(error);

        const deleteTable = await run_raw_sql('DELETE FROM instruments')

        const resetId = await run_raw_sql('ALTER TABLE instruments AUTO_INCREMENT = 1;')

        if (deleteTable && deleteTable.length > 0 && deleteTable[0].hasOwnProperty('insertId')) {

            const rows = csvData.trim().split('\n');
            const headers = rows[0].split(',');

            const insert_result = [];
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const obj = {};
                const rowValues = row.split(',');
                headers.forEach((header, index) => {
                    obj['instrument_token'] = rowValues[0];
                    obj['exchange_token'] = rowValues[1];
                    obj['trading_symbol'] = rowValues[2];
                    obj['name'] = sanitizeString(rowValues[3]);
                    if (rowValues[5] == '') {
                        obj['expiry'] = '1970-01-01 00:00:00';
                    } else {
                        obj['expiry'] = rowValues[5];
                    }
                    obj['strike'] = sanitizeString(rowValues[6]);
                    obj['lot_size'] = sanitizeString(rowValues[8]);
                    obj['instrument_type'] = rowValues[9];
                    obj['segment'] = rowValues[10];
                    obj['exchange'] = rowValues[11];
                });

                let insert_res = await insert_data_in_table({ table_name: 'instruments', data: [obj] });

                if (insert_res && insert_res.length > 0 && insert_res[0].hasOwnProperty('insertId')) {
                    console.log(obj);
                    console.log('Inserted');
                } else {
                    console.log(obj);
                    console.log(insert_res);
                    console.log('Not Inserted');
                    break;  // Exit the loop
                }
            }

        }

    });

}


function sanitizeString(str) {
    return str.replace(/["'`]/g, '');
}


function checkAndRunUpdate() {
    const now = new Date();
    if (now.getHours() === 9 && now.getMinutes() === 1) {
        update_csv();
    }
}

// Check and run the update every minute
setInterval(checkAndRunUpdate, 60000);

// Updating CSV for Instruments
