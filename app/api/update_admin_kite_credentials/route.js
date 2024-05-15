import { NextRequest, NextResponse } from "next/server";
import { get_table_data_by_array, update_data_in_table, insert_data_in_table } from "@/lib/db";

export async function POST(request) {
    const data = await request.json()

    let update_access_token = await update_data_in_table({
        table_name: 'kite_credentials',
        where_array: {
            user_id: 1
        },
        data: {
            is_expired: 0,
            request_token: data.request_token,
            access_token: data.access_token
        }
    })

    if (update_access_token.status) {
        return NextResponse.json({
            status: true,
            message: 'Kite Credentials Updated Successfully',
            client_message: 'Kite Credentials Updated Successfully'
        })

    } else {
        return NextResponse.json({
            status: false,
            message: 'SQL Updation Error',
            client_message: 'Server Error Occured'
        })
    }
}