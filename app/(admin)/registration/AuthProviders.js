"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'


const AuthProviders = () => {
    return (
        <div className="btn-wrapper text-center">
             <button onClick={() => signIn("github")} className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button">
                <Image src={'/img/github.svg'} alt="..." width={0} height={0} className="w-5 mr-1" />
                Github
            </button>
            <button className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                type="button">
                <Image src={'/img/google.svg'} alt="..." width={0} height={0} className="w-5 mr-1" />
                Google
            </button>
        </div>
    )
}

export default AuthProviders