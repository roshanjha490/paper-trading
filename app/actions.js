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

        console.log(db_response)

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


}


export async function get_token_status() {
    const session = await getServerSession()

    let sql = 'SELECT kite_credentials.request_token, kite_credentials.is_expired FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE `email` = "' + session.user.email + '"';

    let response = await run_raw_sql(sql)

    return response[0][0]
}


export async function buy_instrument(formData) {
    console.log(formData)

    let instrument = await get_table_data_by_array({
        table_name: 'instruments', where_array: {
            instrument_token: formData.instrument_token
        }, order_by: 'id'
    })

    instrument = instrument[0][0]

    console.log(instrument)

    return {
        status: true,
        response: 'buy instrument response',
        message: 'Successfull',
    }



}



function sha256Hash(data) {
    createHash
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}


