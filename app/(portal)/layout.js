import { Inter } from "next/font/google";
import React from 'react'
import SessionWrapper from "../component/SessionWrapper";
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import ProfileBtn from "./components/ProfileBtn";
import NavBar from "./components/NavBar";
import { Toaster } from 'react-hot-toast';
// import ExpiredToken from "./components/ExpiredToken";
// import { get_token_status } from "../actions";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Live Trade Dashboard",
    description: "",
};

const NotesLayout = async ({ children }) => {

    const session = await getServerSession()

    // const token_status = get_token_status()

    if (session && session.user) {
        return (
            <SessionWrapper>

                <div className="w-full h-screen">

                    <div className="w-full h-full grid grid-cols-6">

                        <div className="w-full h-full parent">
                            <NavBar></NavBar>
                        </div>

                        <div className="w-full h-full relative col-span-5 flex flex-col">
                            <div className="z-[90] w-full h-[80px] sticky top-[0px] left-[0px] bg-slate-800 flex justify-end items-center px-[20px] z-1">
                                <ProfileBtn></ProfileBtn>
                            </div>

                            <div className="w-full h-full bg-white">
                                {children}
                            </div>
                        </div>

                    </div>
                </div>

                <Toaster position="top-center" />

                {/* <ExpiredToken token_status={token_status}></ExpiredToken> */}

            </SessionWrapper >
        )
    } else {
        redirect("/login")
    }
}

export default NotesLayout