"use client"
import React from 'react';
import SignOut from '../components/ProfileBtn';
import { useState, useEffect } from 'react';
import useWebSocket from './websocket';
import { LuRefreshCcwDot } from "react-icons/lu";
import { get_positions } from '@/app/actions';
import SellFormModal from './SellFormModal';

const Notes = () => {

  const livePrices = useWebSocket()

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      const response = await get_positions();
      setPositions(response);
    };

    fetchPositions();
  }, []);

  // Function to calculate profit or loss and return corresponding class
  const calculateProfitLossClass = (currentPrice, purchasedPrice) => {
    const profitLoss = currentPrice - purchasedPrice;
    return profitLoss >= 0 ? 'text-green-500' : 'text-red-500';
  };


  const [currentModalIndex, setCurrentModalIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index) => {
    setIsModalOpen(true);
    setCurrentModalIndex(index);
    document.body.style.overflow = 'hidden';
  };


  return (
    <>
      <div className='w-full h-full bg-slate-100 p-20'>
        <div className="w-full h-auto bg-white">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <hr />
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
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
                    Purchased At
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rem. Qty.
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='max-h-[500px] overflow-hidden'>

                {
                  positions.map((position, index) => (
                    <>
                      <tr>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            #{(5999 - position.id) + (4000 + (position.id) * 2)}
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {position.instrument_type}
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {position.trading_symbol}
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span aria-hidden className="z-0 absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                            <span className="relative">{position.exchange}</span>
                          </span>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            <small><b>₹{position.purchased_at}</b></small>
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {position.remaining_quantity}
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className={`whitespace-no-wrap ${calculateProfitLossClass(
                            livePrices.find((tick) => tick.instrument_token === position.instrument_token)?.current_price || 0,
                            position.purchased_at
                          )}`}>
                            <small><b>₹{livePrices.find((tick) => tick.instrument_token === position.instrument_token)?.current_price || 0}</b></small>
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                          <button onClick={() => openModal(index)} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            Sell Position
                          </button>


                          {isModalOpen && currentModalIndex === index && (
                            <SellFormModal
                              position={position}
                              index={index}
                              onClose={() => {
                                setIsModalOpen(false);
                                setCurrentModalIndex(null);
                                document.body.style.overflow = '';
                              }}></SellFormModal>
                          )}

                        </td>

                      </tr >
                    </>
                  ))
                }

                {positions.length < 1 && (<>
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No Positions to Show
                    </td>
                  </tr>
                </>)}

              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  )
}

export default Notes