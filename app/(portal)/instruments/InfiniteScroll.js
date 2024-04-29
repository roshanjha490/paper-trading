"use client"
import React from 'react'
import { get_instruments_data } from '@/app/actions';
import { useState, useEffect, useRef } from 'react';
import PurchaseFormModal from './PurchaseFormModal';


const InfiniteScroll = () => {

    const [instruments, setinstruments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const loader = useRef(null);

    const [currentModalIndex, setCurrentModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showStopLossInput, setShowStopLossInput] = useState(false);

    const openModal = (index) => {
        setIsModalOpen(true);
        setCurrentModalIndex(index);
        document.body.style.overflow = 'hidden';
    };

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const response = await get_instruments_data(searchTerm, offset);

                if (response.length < 10) {
                    setHasMore(false);
                }

                setinstruments([...instruments, ...response]);

                console.log(instruments)

            } catch (error) {
                console.error('Error fetching visitors:', error);
            }
        };

        fetchInstruments();
    }, [searchTerm, offset]);

    useEffect(() => {

        const handleScroll = () => {
            if (loader.current && window.innerHeight + window.scrollY >= loader.current.offsetTop) {
                if (hasMore) {
                    setOffset(offset + 10); // or however many you want to load at once
                }
            }
        };



        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, offset]);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setOffset(0);
        setHasMore(true);
        setinstruments([]);
    };

    return (
        <>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <div className="p-[20px] bg-white dark:bg-gray-900">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-[10px]">
                        <div className="z-0 absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="pl-[35px] w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input onChange={handleSearchChange} type="text" id="table-search" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                    </div>
                </div>
                <hr />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Trading Symbol
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Instrument Token
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Exchange
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Purchase Option
                            </th>
                        </tr>
                    </thead>
                    <tbody className='max-h-[500px] overflow-hidden'>
                        {
                            instruments.map((instrument, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {instrument.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {instrument.trading_symbol}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {instrument.instrument_token}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                            <span aria-hidden className="z-0 absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                            <span className="relative">{instrument.exchange}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                        <button onClick={() => openModal(index)} data-modal-target={'crud_modal_' + index} data-modal-toggle={'crud_modal_' + index} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                            Buy Instrument
                                        </button>


                                        {isModalOpen && currentModalIndex === index && (
                                            <PurchaseFormModal
                                                instrument={instrument}
                                                index={index}
                                                onClose={() => {
                                                    setIsModalOpen(false);
                                                    setCurrentModalIndex(null);
                                                    document.body.style.overflow = '';
                                                }}
                                            />
                                        )}

                                    </td>
                                </tr>
                            ))
                        }
                        <tr ref={loader}>
                            <td colSpan="5" className="text-center py-4">
                                {hasMore ? 'Loading...' : 'No more items'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default InfiniteScroll