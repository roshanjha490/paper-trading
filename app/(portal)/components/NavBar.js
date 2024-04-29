"use client"
import React from 'react'
import Link from "next/link";
import { AiOutlineStock } from "react-icons/ai";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { usePathname } from 'next/navigation'
import { useEffect } from 'react';
import { MdBorderColor } from "react-icons/md";

const NavBar = () => {
    const pathname = usePathname()

    useEffect(() => {
        const childElement = document.querySelector('.child');
        const parentElement = document.querySelector('.parent');
        childElement.style.width = parentElement.offsetWidth + 'px';
    }, [])


    return (
        <div className="child w-[250px] h-[100%] bg-slate-800 fixed z-10">
            <div className="w-full h-[80px] pb-[10px] bg-slate-800 logo flex justify-center items-end">
                <p className="text-white font-mono text-[30px]">Trading App.</p>
            </div>

            <div className="w-full h-[55px] bg-slate-800 nav_border">
                <Link href="/live-trade">
                    <div className={` ${pathname === '/live-trade' ? 'bg-slate-600 w-full h-full grid grid-cols-6 px-[10px] hover:bg-slate-600 duration-[0.2s]' : 'w-full h-full grid grid-cols-6 px-[10px] hover:bg-slate-600 duration-[0.2s]'}`}>
                        <div className="w-full h-full flex justify-end items-center">
                            <AiOutlineStock className="text-white text-[20px]" />
                        </div>
                        <div className="w-full h-full col-span-5 flex justify-start items-center px-[10px]">
                            <p className="text-white text-[15px] font-mono">Positions</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="w-full h-[55px] bg-slate-800 nav_border">
                <Link href="/order-history">
                    <div className={` ${pathname === '/order-history' ? 'bg-slate-600 w-full h-full grid grid-cols-6 px-[10px] hover:bg-slate-600 duration-[0.2s]' : 'w-full h-full grid grid-cols-6 px-[10px] hover:bg-slate-600 duration-[0.2s]'}`}>
                        <div className="w-full h-full flex justify-end items-center">
                            <MdBorderColor className="text-white text-[20px]" />
                        </div>
                        <div className="w-full h-full col-span-5 flex justify-start items-center px-[10px]">
                            <p className="text-white text-[15px] font-mono">Order History</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="w-full h-[55px] bg-slate-800 nav_border">
                <Link href="/instruments">
                    <div className={` ${pathname === '/instruments' ? 'bg-slate-600 w-full h-full grid grid-cols-6 px-[10px] hover:bg-slate-600 duration-[0.2s]' : 'w-full h-full grid grid-cols-6 px-[10px] hover:bg-slate-600 duration-[0.2s]'}`}>
                        <div className="w-full h-full flex justify-end items-center">
                            <HiClipboardDocumentList className="text-white text-[20px]"></HiClipboardDocumentList>
                        </div>
                        <div className="w-full h-full col-span-5 flex justify-start items-center px-[10px]">
                            <p className="text-white text-[15px] font-mono">Instruments</p>
                        </div>
                    </div>
                </Link>
            </div>

        </div>
    )
}

export default NavBar