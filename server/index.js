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


// Method defined for websocket
wss.on('connection', async function connection(ws) {

    let isClientConnected = true;

    const KiteTicker = require("kiteconnect").KiteTicker;

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

    ticker.connect();

    ticker.on("ticks", onTicks);

    ticker.on("connect", subscribe);

    ticker.on("disconnect", () => {

        if (isClientConnected) {
            console.log('Reconnection Attempted')
            ticker.autoReconnect(true)
        } else {
            console.log('Kite is Disconnected')
        }

    });

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
    console.log('checked status')
    if (now.getHours() === 11 && now.getMinutes() === 16) {
        console.log('came here')
        update_csv();
        console.log('came here 2')
    }
}


// Check and run the update every minute
setInterval(checkAndRunUpdate, 60000);