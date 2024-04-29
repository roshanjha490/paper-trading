"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ExpiredToken = (props) => {
    const pathname = usePathname();
    const [token_status, setToken_status] = useState(null);

    useEffect(() => {
        setToken_status(JSON.parse(props.token_status.value));
    }, [props.token_status.value]);

    if (!token_status) {
        return null; // or return a loading state
    }

    if (pathname === '/profile-settings') {
        return null;
    } else {

        if (token_status.request_token === null || token_status.is_expired === 1) {
            return (
                <div style={{ backgroundColor: "#000000ad" }} className="w-full h-full fixed top-0 left-0 z-[999]">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit p-[30px] bg-white rounded">
                            {token_status.request_token === null && (
                                <>
                                    <p>Kite API Keys are not set. Kindly Set</p>
                                    <br />
                                    <div className="w-full h-full flex justify-center items-center">
                                        <Link legacyBehavior href="/profile-settings">
                                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Click here to set API Keys</button>
                                        </Link>
                                    </div>
                                </>
                            )}
                            {token_status.is_expired === 0 && (
                                <>
                                    <p>Kite API token has been expired Kindly update</p>
                                    <br />
                                    <div className="w-full h-full flex justify-center items-center">
                                        <Link legacyBehavior href="/profile-settings">
                                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Click here to update API token</button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default ExpiredToken