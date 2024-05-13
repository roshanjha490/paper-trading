"use server"
import { get_table_data_by_array, run_raw_sql, update_data_in_table, insert_data_in_table } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { createHash } from "crypto";

export async function checkLogin(formData) {

    let loginFormSchema = z.object({
        email: z.string().email({
            message: 'Invalid Email',
        }),
        password: z.string().min(6, { message: "Password Length should be more than 6 Charecters" })
    })

    let validateFields = await loginFormSchema.safeParse({
        email: formData.email,
        password: formData.password
    })

    if (!validateFields.success) {
        return {
            success: false,
            error: validateFields.error.flatten().fieldErrors,
        }
    } else {

        let sql = {
            table_name: 'users',
            where_array: {
                email: formData.email,
                password: formData.password
            },
            order_by: 'id'
        }

        let db_response = await get_table_data_by_array(sql)

        if (db_response[0].length === 0) {
            return {
                success: false,
                error: 'User Not Found'
            }
        }

        if (db_response[0].length === 1) {
            return {
                success: true,
                error: 'User Found'
            }
        }

        if (db_response[0].length > 1) {
            return {
                success: true,
                error: 'Unexpected Error Occured'
            }
        }

    }

}



export async function get_instruments_data(searchTerm, offset = 0, limit = 10) {

    let query = `SELECT * FROM instruments`;

    if (searchTerm) {
        query += ` WHERE trading_symbol LIKE '%${searchTerm}%'`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    let response = await run_raw_sql(query)

    return response[0]

}


export async function get_userdata() {
    const session = await getServerSession()

    let sql = 'SELECT users.*, kite_credentials.api_key, kite_credentials.api_secret, kite_credentials.access_token, kite_credentials.request_token, kite_credentials.is_expired, kite_credentials.created_at AS rkj_time FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE `email` = "' + session.user.email + '"';

    let response = await run_raw_sql(sql)

    return response[0][0]

}


export async function saveZerodhaValues(formData) {

    const session = await getServerSession()

    let sql = 'SELECT users.*, kite_credentials.api_key, kite_credentials.api_secret, kite_credentials.access_token,  kite_credentials.request_token, kite_credentials.is_expired, kite_credentials.created_at AS rkj_time FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE `email` = "' + session.user.email + '"';

    let user_data = await run_raw_sql(sql)

    user_data = user_data[0][0]

    if (Object.keys(user_data).length > 0) {

        if (user_data.api_key != null) {

            const urlencoded = new URLSearchParams();
            urlencoded.append("api_key", formData.api_key);
            urlencoded.append("request_token", formData.request_token);
            urlencoded.append("checksum", sha256Hash(formData.api_key + formData.request_token + formData.secret_key));

            const myHeaders = new Headers();
            myHeaders.append("X-Kite-Version", "3");
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const kite_access_token = await fetch("https://api.kite.trade/session/token", {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            }).then((response) => response.text())
                .then(async (result) => {
                    result = JSON.parse(result)
                    if (result.status == 'error') {
                        return {
                            status: false,
                            response: result,
                            message: 'JSON not converted',
                            client_message: result.message
                        }
                    } else {
                        let update_access_token = await update_data_in_table({
                            table_name: 'kite_credentials',
                            where_array: {
                                user_id: user_data.id
                            },
                            data: {
                                api_key: formData.api_key,
                                api_secret: formData.secret_key,
                                request_token: formData.request_token,
                                is_expired: 0,
                                access_token: result.data.access_token
                            }
                        })

                        if (update_access_token.status) {
                            return {
                                status: true,
                                response: JSON.stringify(update_access_token),
                                message: 'Kite Credentials Updated Successfully',
                                client_message: 'Kite Credentials Updated Successfully'
                            }
                        } else {
                            return {
                                status: false,
                                response: JSON.stringify(update_access_token),
                                message: 'SQL Updation Error',
                                client_message: 'Server Error Occured'
                            }
                        }

                    }
                })
                .catch((error) => {
                    return {
                        status: false,
                        response: error,
                        message: 'Session API Issue',
                        client_message: 'Server Error Occured'
                    }
                });

            return kite_access_token

        } else {

            const urlencoded = new URLSearchParams();
            urlencoded.append("api_key", formData.api_key);
            urlencoded.append("request_token", formData.request_token);
            urlencoded.append("checksum", sha256Hash(formData.api_key + formData.request_token + formData.secret_key));

            const myHeaders = new Headers();
            myHeaders.append("X-Kite-Version", "3");
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const kite_access_token = await fetch("https://api.kite.trade/session/token", {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            }).then((response) => response.text())
                .then(async (result) => {
                    result = JSON.parse(result)
                    if (result.status == 'error') {
                        return {
                            status: false,
                            response: result,
                            message: 'JSON not converted',
                            client_message: result.message
                        }
                    } else {

                        let kite_data = {
                            table_name: 'kite_credentials',
                            data: [{
                                user_id: user_data.id,
                                api_key: formData.api_key,
                                api_secret: formData.secret_key,
                                request_token: formData.request_token,
                                is_expired: 0,
                                access_token: result.data.access_token
                            }]
                        }

                        let res = await insert_data_in_table(kite_data)

                        if (res && res.length > 0 && res[0].hasOwnProperty('insertId')) {
                            return {
                                status: true,
                                response: JSON.stringify(res),
                                message: 'Kite Credentials Inserted Successfully',
                                client_message: 'Kite Credentials Updated Successfully'
                            }
                        } else {
                            return {
                                status: false,
                                response: JSON.stringify(res),
                                message: 'Insertion Not Happened',
                                client_message: 'Server Error Occured'
                            }
                        }

                    }
                })
                .catch((error) => {
                    return {
                        status: false,
                        response: error,
                        message: 'Session API Issue',
                        client_message: 'Server Error Occured'
                    }
                });

            return kite_access_token
        }

    } else {

        return {
            status: false,
            response: user_data,
            message: 'Form Data not in proper format',
            client_message: 'Server Error Occured'
        }

    }

}


export async function get_token_status() {
    const session = await getServerSession()

    let sql = 'SELECT kite_credentials.request_token, kite_credentials.is_expired FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE `email` = "' + session.user.email + '"';

    let response = await run_raw_sql(sql)

    return response[0][0]
}


export async function buy_instrument(formData) {

    const session = await getServerSession()

    let user_sql = 'SELECT users.* FROM `users` WHERE `email` = "' + session.user.email + '"';

    let user_data = await run_raw_sql(user_sql)

    user_data = user_data[0][0]

    let sql = 'SELECT kite_credentials.* FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE users.id = 1 AND kite_credentials.is_expired = 0;';

    let kite_credentials = await run_raw_sql(sql)

    if (kite_credentials[0].length > 0) {

        kite_credentials = kite_credentials[0][0]

        const myHeaders = new Headers();
        myHeaders.append("X-Kite-Version", "3");
        myHeaders.append("Authorization", "token " + kite_credentials.api_key + ":" + kite_credentials.access_token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        let order_status = await fetch("https://api.kite.trade/quote?i=" + formData.exchange + ":" + formData.trading_symbol, requestOptions)
            .then((response) => response.text())
            .then(async (result) => {

                result = JSON.parse(result)

                if (!(Object.keys(result.data).length === 0)) {

                    let [instrument] = Object.values(result.data)

                    if (formData.hasOwnProperty('stopLossAmount')) {

                        let insert_order = await insert_data_in_table({
                            table_name: 'orders',
                            data: [{
                                instrument_token: instrument.instrument_token,
                                trading_symbol: formData.trading_symbol,
                                exchange: formData.exchange,
                                user_id: user_data.id,
                                order_type: 'PUR',
                                instrument_type: formData.instrument_type,
                                purchased_at: instrument.last_price,
                                quantity_purchased: formData.quantity,
                                stop_loss_amt: formData.stopLossAmount
                            }]
                        })

                        if (insert_order && insert_order.length > 0 && insert_order[0].hasOwnProperty('insertId')) {
                            return {
                                status: true,
                                response: JSON.stringify(insert_order),
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

                    } else {

                        let insert_order = await insert_data_in_table({
                            table_name: 'orders',
                            data: [{
                                instrument_token: instrument.instrument_token,
                                trading_symbol: formData.trading_symbol,
                                exchange: formData.exchange,
                                user_id: user_data.id,
                                order_type: 'PUR',
                                instrument_type: formData.instrument_type,
                                purchased_at: instrument.last_price,
                                quantity_purchased: formData.quantity
                            }]
                        })

                        if (insert_order && insert_order.length > 0 && insert_order[0].hasOwnProperty('insertId')) {
                            return {
                                status: true,
                                response: JSON.stringify(insert_order),
                                message: 'Order Inserted Successfully',
                                client_message: 'Order Placed Successfully',
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

                } else {
                    return {
                        status: false,
                        response: JSON.stringify(result),
                        message: 'Trading Symbol not correct',
                        client_message: 'Server Error Occured',
                    }
                }

            })
            .catch((error) => {
                return {
                    status: false,
                    response: error,
                    message: 'Quote API Error',
                    client_message: 'Server Error Occured',
                }
            });

        return order_status

    } else {
        return {
            status: false,
            response: JSON.stringify(kite_credentials),
            message: 'Access Token Expired',
            client_message: 'Server Error Occured',
        }
    }

}


export async function sell_instrument(formData) {

    let order_details = await get_table_data_by_array({
        table_name: 'orders',
        where_array: {
            id: formData.instrument_id
        },
        order_by: 'id'
    });

    if (order_details[0].length > 0) {

        order_details = order_details[0][0]

        if (order_details.quantity_purchased < formData.quantity) {
            return {
                status: false,
                response: JSON.stringify(order_details),
                message: 'Order Details',
                client_message: 'Sell Quantity is more than Purchased Quantity',
            }
        }

        let sql = 'SELECT kite_credentials.* FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE users.id = 1 AND kite_credentials.is_expired = 0;';

        let kite_credentials = await run_raw_sql(sql)

        if (kite_credentials[0].length > 0) {

            kite_credentials = kite_credentials[0][0]

            const myHeaders = new Headers();
            myHeaders.append("X-Kite-Version", "3");
            myHeaders.append("Authorization", "token " + kite_credentials.api_key + ":" + kite_credentials.access_token);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            let order_status = await fetch("https://api.kite.trade/quote?i=" + order_details.exchange + ":" + order_details.trading_symbol, requestOptions)
                .then((response) => response.text())
                .then(async (result) => {

                    result = JSON.parse(result)

                    let [instrument] = Object.values(result.data)

                    if (!(Object.keys(result.data).length === 0)) {
                        let insert_order = await insert_data_in_table({
                            table_name: 'orders',
                            data: [{
                                instrument_token: order_details.instrument_token,
                                trading_symbol: order_details.trading_symbol,
                                exchange: order_details.exchange,
                                user_id: order_details.user_id,
                                order_type: 'SELL',
                                instrument_type: order_details.instrument_type,
                                sold_at: instrument.last_price,
                                quantity_sold: formData.quantity,
                                order_id: order_details.id
                            }]
                        })

                        if (insert_order && insert_order.length > 0 && insert_order[0].hasOwnProperty('insertId')) {
                            return {
                                status: true,
                                response: JSON.stringify(insert_order),
                                message: 'Order Inserted Successfully',
                                client_message: 'Poisition Sold Successfully @₹' + instrument.last_price,
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
                            response: JSON.stringify(result),
                            message: 'Trading Symbol not correct',
                            client_message: 'Server Error Occured',
                        }
                    }
                })
                .catch((error) => {
                    return {
                        status: false,
                        response: error,
                        message: 'Quote API Error',
                        client_message: 'Server Error Occured',
                    }
                });

            return order_status


        } else {
            return {
                status: false,
                response: kite_credentials,
                message: 'Access Token Expired',
                client_message: 'Server Error Occured',
            }
        }
    } else {
        return {
            status: false,
            response: JSON.stringify(order_details),
            message: 'Order Details Not Found',
            client_message: 'Server Error Occured',
        }
    }



}


export async function get_positions() {

    const session = await getServerSession()

    let sql = 'SELECT o1.*, o1.quantity_purchased - COALESCE(SUM(o2.quantity_sold), 0) AS remaining_quantity FROM orders o1 LEFT JOIN orders o2 ON o1.id = o2.order_id AND o2.order_type = "SELL" INNER JOIN users u ON o1.user_id = u.id WHERE u.email = "' + session.user.email + '" AND o1.order_type = "PUR" GROUP BY o2.order_id';

    let response = await run_raw_sql(sql)

    return response[0]

}


export async function get_trades() {

    const session = await getServerSession()

    let sql = 'SELECT o1.*, o2.purchased_at FROM orders o1 LEFT JOIN orders o2 ON o1.order_id = o2.id INNER JOIN users u ON o1.user_id = u.id WHERE u.email = "' + session.user.email + '" AND o1.order_type = "SELL" ';

    let response = await run_raw_sql(sql)

    return response[0]


}


function sha256Hash(data) {
    createHash
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}