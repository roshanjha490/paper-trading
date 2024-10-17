import { NextResponse } from "next/server";
import { get_table_data_by_array, insert_data_in_table } from "@/lib/db";

export async function POST(request) {

    const data = await request.json()

    return NextResponse.json({
        success: true,
        response: data
    })

}