import { NextResponse, NextRequest } from "next/server";
import { get_table_data_by_array, insert_data_in_table } from "@/lib/db";

export async function GET(request) {

    let sq1 = {
        table_name: 'visitors',
        where_array: {},
        order_by: 'id'
    }

    try {

        let data = await get_table_data_by_array(sq1)

        return NextResponse.json({
            success: true,
            data: data[0]
        })


    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error
        })

    }


}

export async function POST(request) { }
