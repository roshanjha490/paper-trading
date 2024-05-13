import { NextRequest, NextResponse } from "next/server";
import { get_table_data_by_array, insert_data_in_table } from "@/lib/db";

export async function POST(request) {

    const data = await request.json()

    if (data.order_type === "BUY") {

        const [[instrument]] = await get_table_data_by_array({
            table_name: 'instruments',
            where_array: {
                instrument_token: data.instrument_token
            },
            order_by: 'id'
        });

        const [[kite_credential]] = await get_table_data_by_array({
            table_name: 'kite_credentials',
            where_array: {
                user_id: 1
            },
            order_by: 'id'
        });

        const myHeaders2 = new Headers();
        myHeaders2.append("X-Kite-Version", "3");
        myHeaders2.append("Authorization", "token " + kite_credential.api_key + ":" + kite_credential.access_token + "");

        const requestOptions = {
            method: "GET",
            headers: myHeaders2,
            redirect: "follow"
        };

        let order_status = await fetch("https://api.kite.trade/quote/ohlc?i=" + instrument.exchange + ":" + instrument.trading_symbol, requestOptions)
            .then((response) => response.text())
            .then(async (result) => {

                result = JSON.parse(result)

                let [quote] = Object.values(result.data)


                if (data.is_sl == 1) {

                    let insert_status = await insert_data_in_table({
                        table_name: 'orders',
                        data: [{
                            instrument_token: instrument.instrument_token,
                            trading_symbol: instrument.trading_symbol,
                            exchange: instrument.exchange,
                            user_id: 1,
                            order_type: 'PUR',
                            instrument_type: instrument.instrument_type,
                            purchased_at: quote.last_price,
                            quantity_purchased: data.quantity,
                            is_stop_loss_amt: 1,
                            stop_loss_amt: data.sl_price
                        }]
                    })

                    if (insert_status && insert_status.length > 0 && insert_status[0].hasOwnProperty('insertId')) {
                        return {
                            status: true,
                            response: JSON.stringify(insert_status),
                            message: 'Order Inserted Successfully',
                            client_message: 'Order Placed Successfully @₹' + instrument.last_price,
                        }
                    } else {
                        return {
                            status: false,
                            response: JSON.stringify(insert_order),
                            message: 'Order Not Inserted',
                            client_message: 'Server Error Occured',
                        }
                    }
                }

                if (data.is_sl == 0) {

                    let insert_status = await insert_data_in_table({
                        table_name: 'orders',
                        data: [{
                            instrument_token: instrument.instrument_token,
                            trading_symbol: instrument.trading_symbol,
                            exchange: instrument.exchange,
                            user_id: 1,
                            order_type: 'PUR',
                            instrument_type: instrument.instrument_type,
                            purchased_at: quote.last_price,
                            quantity_purchased: data.quantity
                        }]
                    })

                    if (insert_status && insert_status.length > 0 && insert_status[0].hasOwnProperty('insertId')) {
                        return {
                            status: true,
                            response: JSON.stringify(insert_status),
                            message: 'Order Inserted Successfully',
                            client_message: 'Order Placed Successfully @₹' + instrument.last_price,
                        }
                    } else {
                        return {
                            status: false,
                            response: JSON.stringify(insert_order),
                            message: 'Order Not Inserted',
                            client_message: 'Server Error Occured',
                        }
                    }

                }

            })
            .catch((error) => console.error(error));

        return NextResponse.json(order_status)

    }

    if (data.order_type === "SELL") {

        const [[order_details]] = await get_table_data_by_array({
            table_name: 'orders',
            where_array: {
                id: data.order_id
            },
            order_by: 'id'
        });

        const [[kite_credential]] = await get_table_data_by_array({
            table_name: 'kite_credentials',
            where_array: {
                user_id: 1
            },
            order_by: 'id'
        });

        if (order_details.quantity_purchased < data.quantity) {
            return NextResponse.json({
                status: false,
                response: JSON.stringify(order_details),
                message: 'Order Details',
                client_message: 'Sell Quantity is more than Purchased Quantity',
            })
        }

        const myHeaders2 = new Headers();
        myHeaders2.append("X-Kite-Version", "3");
        myHeaders2.append("Authorization", "token " + kite_credential.api_key + ":" + kite_credential.access_token + "");

        const requestOptions = {
            method: "GET",
            headers: myHeaders2,
            redirect: "follow"
        };

        let order_status = await fetch("https://api.kite.trade/quote/ohlc?i=" + order_details.exchange + ":" + order_details.trading_symbol, requestOptions)
            .then((response) => response.text())
            .then(async (result) => {

                result = JSON.parse(result)

                let [quote] = Object.values(result.data)

                if (!(Object.keys(result.data).length === 0)) {

                    let insert_status = await insert_data_in_table({
                        table_name: 'orders',
                        data: [{
                            instrument_token: order_details.instrument_token,
                            trading_symbol: order_details.trading_symbol,
                            exchange: order_details.exchange,
                            user_id: order_details.user_id,
                            order_type: 'SELL',
                            instrument_type: order_details.instrument_type,
                            sold_at: quote.last_price,
                            quantity_sold: data.quantity,
                            order_id: order_details.id
                        }]
                    })

                    if (insert_status && insert_status.length > 0 && insert_status[0].hasOwnProperty('insertId')) {
                        return {
                            status: true,
                            response: JSON.stringify(insert_status),
                            message: 'Order Inserted Successfully',
                            client_message: 'Order Placed Successfully @₹' + instrument.last_price,
                        }
                    } else {
                        return {
                            status: false,
                            response: JSON.stringify(insert_order),
                            message: 'Order Not Inserted',
                            client_message: 'Server Error Occured',
                        }
                    }
                }

            })
            .catch((error) => console.error(error));

        return NextResponse.json(order_status)

    }

    return NextResponse.json({
        success: true
    })
}