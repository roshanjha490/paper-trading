"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { get_trades } from '@/app/actions';

const page = () => {

    const [trades, settrades] = useState([])

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await get_trades();
            settrades(response);
        };

        fetchPositions();
    }, []);


    // Function to calculate profit or loss and return corresponding class
    const calculateProfitLossClass = (soldPrice, purchasedPrice) => {
        console.log(JSON.stringify(trades))
        const profitLoss = soldPrice - purchasedPrice;
        return profitLoss >= 0 ? 'text-green-500' : 'text-red-500';
    };

    const calculateTotalProfitLoss = () => {
        const totalProfitLoss = trades.reduce((acc, item) => {
            const profitLoss =
                item.order_type === 'SELL'
                    ? (item.sold_at - item.purchased_at) * item.quantity_sold
                    : (item.purchased_at - item.sold_at) * item.quantity_sold;
            return acc + profitLoss;
        }, 0);

        const formattedProfitLoss = Math.abs(totalProfitLoss).toFixed(2);
        const profitLossColor = totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500';

        return (
            <p className={`whitespace-no-wrap ${profitLossColor}`}>₹{formattedProfitLoss}</p >
        );
    };

    return (
        <div className='w-full h-full bg-slate-100 p-20'>
            <div className="w-full h-auto bg-white">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <hr />
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Sell Order ID
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Purchase Order ID
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Instrument Type
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Trading Symbol
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Exchange
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Quantity Traded
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Total P&L
                                </th>
                            </tr>
                        </thead>
                        <tbody className='max-h-[500px] overflow-hidden'>

                            {
                                trades.map((trade, index) => (
                                    <>
                                        <tr>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    #{(5999 - trade.id) + (4000 + (trade.id) * 2)}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    #{(5999 - trade.order_id) + (4000 + (trade.order_id) * 2)}
                                                </p>
                                            </td>


                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {trade.instrument_type}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {trade.trading_symbol}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                    <span aria-hidden className="z-0 absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                    <span className="relative">{trade.exchange}</span>
                                                </span>
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {trade.quantity_sold}
                                                </p>
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className={`whitespace-no-wrap ${calculateProfitLossClass(trade.sold_at, trade.purchased_at)}`}>
                                                    {
                                                        trade.sold_at > trade.purchased_at ? (<small><b>₹{((trade.sold_at - trade.purchased_at).toFixed(2)) * trade.quantity_sold}</b></small>) : (<small><b>₹{((trade.purchased_at - trade.sold_at).toFixed(2)) * trade.quantity_sold}</b></small>)
                                                    }
                                                </p>
                                            </td>


                                        </tr >
                                    </>
                                ))
                            }


                            {trades.length >= 1 && (<>
                                <tr>
                                    <td colSpan="6" className="text-right py-4">
                                        <b>Overall Total Profit/Loss</b>
                                    </td>

                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {calculateTotalProfitLoss()}
                                    </td>
                                </tr>
                            </>)}


                            {trades.length < 1 && (<>
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        No Trades to Show
                                    </td>
                                </tr>
                            </>)}

                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default page