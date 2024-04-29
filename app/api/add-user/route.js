import { NextResponse } from "next/server";
import { get_table_data_by_array, insert_data_in_table } from "@/lib/db";

export async function POST(request) {
    // let sq1 = {
    //     table_name: 'users',
    //     where_array: {
    //         id: 1
    //     },
    //     order_by: 'id'
    // }

    // let sql2 = {
    //     table_name: 'users',
    //     data: {
    //         name: 'Pankaj Jha',
    //         email: 'abc@gmail.com',
    //         password: '131242412'
    //     }
    // }

    // return NextResponse.json({
        // success: true,
        // result: await get_table_data_by_array(sql)
    //     result: await insert_data_in_table(sql2)
    // })
}



