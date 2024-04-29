import { Inter } from "next/font/google";
import Link from "next/link";
import React from "react";
import SessionWrapper from "../component/SessionWrapper";
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Research App",
    description: "",
};

const AdminLayout = async ({ children }) => {

    const session = await getServerSession()

    if (session && session.user) {
        redirect("/live-trade")
        // return (<><p>Can't Open the page</p></>)
    } else {
        return (
            <>
                <SessionWrapper>
                    <div className="relative w-full h-full min-h-screen">
                        <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-5 navbar-expand-lg">
                            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                                <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                                    <Link href='/'>
                                        <p className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase">
                                            Paper Trading App
                                        </p>
                                    </Link>
                                </div>
                                <div className="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none block rounded shadow-lg" id="example-navbar-warning">
                                    <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                                        <li className="flex items-center">
                                            <a className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-nextjs%2F"
                                                target="_blank">

                                                <i className="lg:text-blueGray-200 text-blueGray-400 fab fa-twitter text-lg leading-lg " />
                                                <span className="lg:hidden inline-block ml-2">Share</span>
                                            </a>
                                        </li>

                                        <li className="flex items-center">
                                            <a className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                                href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-nextjs%2F&text=Start%20your%20development%20with%20a%20Free%20Tailwind%20CSS%20and%20NextJS%20UI%20Kit%20and%20Admin.%20Let%20Notus%20NextJS%20amaze%20you%20with%20its%20cool%20features%20and%20build%20tools%20and%20get%20your%20project%20to%20a%20whole%20new%20level."
                                                target="_blank">

                                                <i className="lg:text-blueGray-200 text-blueGray-400 fab fa-twitter text-lg leading-lg " />
                                                <span className="lg:hidden inline-block ml-2">Tweet</span>
                                            </a>
                                        </li>

                                        <li className="flex items-center">
                                            <a className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                                href="https://github.com/creativetimofficial/notus-nextjs?ref=nnjs-auth-navbar"
                                                target="_blank">

                                                <i className="lg:text-blueGray-200 text-blueGray-400 fab fa-github text-lg leading-lg " />
                                                <span className="lg:hidden inline-block ml-2">Star</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div className="z-[0] absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
                            style={{
                                backgroundImage: "url('/img/register_bg_2.png')"
                            }}
                        ></div>
                        <main className="h-auto">
                            <section>
                                {children}
                            </section>
                        </main>
                        <footer className="z-[99] w-full h-[50px] flex justify-center items-center">
                            <div>
                                <p className="text-white">Created with ❣️ by Roshan Jha</p>
                            </div>
                        </footer>
                    </div>
                    <Toaster position="top-center"/>
                </SessionWrapper>
            </>
        )

    }
}

export default AdminLayout