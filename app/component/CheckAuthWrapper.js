"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

function CheckAuthWrapper({ children }) {

    const { data: session } = useSession()

    if(session){
        return (<><p>Page is restricted</p></>)
    }else{
        return (<>{children}</>)
    }
}

export default CheckAuthWrapper